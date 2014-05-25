//Daniel Boos
//Project 4: Nim Client
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include        <unistd.h>
#include	<signal.h>
#include	<errno.h>
#include	<sys/types.h>
#include	<sys/socket.h>
#include	<netinet/in.h>
#include	<netdb.h>
#include        <arpa/inet.h>

char user[2048];
char opponent[2048];
char cmove[3];
int row1 = 1;
int row2 = 3;
int row3 = 5;
int row4 = 7;

void displayRow(int i){
	int j;
	for(j=i; j>0; j--){
		printf(" 0");
	}
	printf("\n");
}

void displayBoard(){
	printf("------------------NIM--------------------\n");
	printf("Your Handle: %s\n", user);
	printf("Opponent's Handle: %s\n\n", opponent);
	printf("Board:\n");
	printf("1|");displayRow(row1);
	printf("2|");displayRow(row2);
	printf("3|");displayRow(row3);
	printf("4|");displayRow(row4);
	printf(" +--------------\n");
	printf("   1 2 3 4 5 6 7\n");
	printf("------------------NIM--------------------\n");
}

void move(int r, int c);

void clientmove(){
	char buffer[2048]={0};
	int r, c;
	r=0; c=0;
	printf("Your move (row column):");
	if((fgets(buffer, sizeof (buffer), stdin)==NULL) || ((sscanf(buffer,"%d %d", &r, &c))!=2)){
		printf("Invalid input. Please insert two numbers separated by whitespace.\n");	
		clientmove();
		return;
	}
	
	if(r==0 && c==0){
		printf("You have resigned. Exiting.\n");	
		exit(1);
	}

	if(r>4 || c>7 || r<1 || c<1){
		printf("Your move is off the board.\n");	
		clientmove();
		return;
	}
	cmove[0]='M';
	cmove[1]=(char)(((int)'0')+r);
	cmove[2]=(char)(((int)'0')+c);
	move(r,c);
}

void move(int r, int c){
	if(r==1 && row1>=c)row1=c-1;
	else if(r==1) {
		printf("There is nothing there to remove.\n");	
		clientmove();
		return;
	}
	if(r==2 && row2>=c)row2=c-1;
	else if(r==2) {
		printf("There is nothing there to remove.\n");	
		clientmove();
		return;
	}
	if(r==3 && row3>=c)row3=c-1;
	else if(r==3) {
		printf("There is nothing there to remove.\n");	
		clientmove();
		return;
	}
	if(r==4 && row4>=c)row4=c-1;
	else if(r==4) {
		printf("There is nothing there to remove.\n");	
		clientmove();
		return;
	}
	displayBoard();
}

int gameOver(){
	return row1+row2+row3+row4 == 1;
}

void printsin(struct sockaddr_in *, char *, char *);

int main(int argc, char *argv[]) {
	char tmpstring[2048];
	int ch;
	int r;
	int c;
	
	if(argc > 2){
		fprintf(stderr, "usage: nim or nim -q\n");
		exit(1);
	}
	if(argc == 2 && strcmp(argv[1], "-q")!=0){
		fprintf(stderr, "usage: nim -q\n");
		exit(1);
	}
	
	if(argc == 2 && strcmp(argv[1], "-q")==0){
//		SEND DGRAM
		int socket_fd, cc, cd, ecode;
		struct sockaddr_in *dest;
		struct addrinfo hints, *addrlist;  
		char msgbuf[20];
		
		memset(&hints, 0, sizeof(hints));
		hints.ai_family = AF_INET; hints.ai_socktype = SOCK_DGRAM;
		hints.ai_flags = AI_NUMERICSERV; hints.ai_protocol = 0;
		hints.ai_canonname = NULL; hints.ai_addr = NULL;
		hints.ai_next = NULL;

//		
		ecode = getaddrinfo("0.0.0.0", "13107", &hints, &addrlist);
		if (ecode != 0) {
		  fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(ecode));
		  exit(1);
		}

		dest = (struct sockaddr_in *) addrlist->ai_addr; // Will use in sendto().

		socket_fd = socket (addrlist->ai_family, addrlist->ai_socktype, 0);
		if (socket_fd == -1) {
		  perror ("send_udp:socket");
		  exit (1);
		}

		strcpy(msgbuf,"ROBOT LET ME PASS!");

		cc = sendto(socket_fd,&msgbuf,sizeof(msgbuf),0,(struct sockaddr *) dest,
				sizeof(struct sockaddr_in));

//		connect(socket_fd, (struct sockaddr *)&dest, sizeof(dest));
//		send(socket_fd, &msgbuf, sizeof(msgbuf), 0);	
		
		if (cc < 0) {
		  perror("send_udp:sendto");
		  exit(1);
		}

//		RECEIVE DGRAM
		fd_set mask;
		int hits;
		struct timeval timeout;

		for(;;) {
		    int dsize = sizeof(dest);

		    FD_ZERO(&mask);
		    FD_SET(0,&mask);
		    FD_SET(socket_fd,&mask);
		    timeout.tv_sec = 60;
		    timeout.tv_usec = 0;
		    if ((hits = select(socket_fd+1, &mask, (fd_set *)0, (fd_set *)0,
					   &timeout)) < 0) {
		      perror("fancy_recv_udp:select");
		      exit(1);
		    }
		    if ( (hits==0) || ((hits>0) && (FD_ISSET(0,&mask))) ) {
		      printf("Shutting down\n");
		      exit(0);
		    }

		    if(FD_ISSET(socket_fd,&mask)){
			    char response[2048];
			    cd = recvfrom(socket_fd,&response,sizeof(response),0,(struct sockaddr *) &dest,&dsize);
			    if (cd < 0) perror("recv_udp:recvfrom");
//			    printsin(dest, "recv_udp: ", "Packet from:");
			    printf("Got data ::%s\n",response);
			    fflush(stdout);
			    exit(0);
		    }
		}
	}
	
//	GAME MODE	
//	get hostname of client
//	strcpy(user,"Daniel");  NEED TO GET HOSTNAME AND SEND IT TO MATCH SERVER
//	strcpy(opponent, "Computer");

//	TEMPORARY SOLUTION
	printf("Please insert your name:");
	fgets(tmpstring, sizeof (tmpstring), stdin);
	strcpy(user,tmpstring);

	int sock, left, num, put, ecode;
	struct sockaddr_in *server;
	struct addrinfo hints, *addrlist;

	/*
	   Want a sockaddr_in containing the ip address for the system
	   specified in argv[1] and the port specified in argv[2].
	*/

	memset( &hints, 0, sizeof(hints));
	hints.ai_family = AF_INET; hints.ai_socktype = SOCK_STREAM;
	hints.ai_flags = AI_NUMERICSERV; hints.ai_protocol = 0;
	hints.ai_canonname = NULL; hints.ai_addr = NULL;
	hints.ai_next = NULL;

	ecode = getaddrinfo("0.0.0.0", "60359", &hints, &addrlist);
	if (ecode != 0) {
	  fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(ecode));
	  exit(1);
	}

	server = (struct sockaddr_in *) addrlist->ai_addr;

	/*
	   Create the socket.
	*/
	if ( (sock = socket( addrlist->ai_family, addrlist->ai_socktype, 0 )) < 0 ) {
	  perror("inet_wstream:socket");
	  exit(1);
	}

	/*
	   Connect to data socket on the peer at the specified Internet
	   address.
	*/
	if ( connect(sock, (struct sockaddr *)server, sizeof(struct sockaddr_in)) < 0) {
	  perror("inet_wstream:connect");
	  exit(1);
	}

	/*
	   Write the quote and terminate. This will close the connection on
	   this end, so eventually an "EOF" will be detected remotely.
	*/
	left = sizeof(user); put=0;
	while (left > 0){
	  if((num = write(sock, user+put, left)) < 0) {
	    perror("inet_wstream:write");
	    exit(1);
	  }
	  else left -= num;
	  put += num;
	}

	fd_set mask;
	int hits;
	while(1) {
	  FD_ZERO(&mask);
	  FD_SET(0,&mask);
	  FD_SET(sock,&mask);
	  if ((hits = select(sock+1, &mask, (fd_set *)0, (fd_set *)0,
		                 NULL)) < 0) {
	    perror("fancy_recv_udp:select");
	    exit(1);
	  }

	  if(FD_ISSET(sock, &mask)){
		int cc;
		struct sockaddr_in from;
		socklen_t fsize;
		char  msg[20];
		fsize = sizeof(from);

//		RECEIVE DATAGRAM
		cc = recvfrom(sock,&msg,sizeof(msg),0,(struct sockaddr *)&from,&fsize);
		if (cc < 0) perror("recv_udp:recvfrom");
		printsin( &from, "recv_udp: ", "Packet from:");
		printf("Got data ::%s\n",msg);

//		INSIDE LOOP
		if(msg[0]=='I'){
			strcpy(opponent, msg+1);	
		}

		if(msg[0]=='M'){ //transfer opponents move
			r = msg[1] - '0';
			c = msg[2] - '0';
			move(r,c);
			if(gameOver()){
				printf("YOU LOST!");	
			}
		}

		//clients move
		displayBoard();
		clientmove();

//	  	SEND DATAGRAM
	  	char response[20];
	  	strcpy(response,cmove);
	  	sendto(sock,&response,sizeof(response),0,(struct sockaddr *)&from,fsize);
//	  	connect(d_fd, (struct sockaddr *)&from, fsize);
//	  	send(d_fd, &response, sizeof(response), 0);
	  	fflush(stdout);

		if(gameOver()){
			printf("YOU WON!");
			exit(1);
		}
	  }
	}	
}

void printsin(struct sockaddr_in *sin, char *m1, char *m2 )
{
  char fromip[INET_ADDRSTRLEN];

  printf ("%s %s:\n", m1, m2);
  printf ("  family %d, addr %s, port %d\n", sin -> sin_family,
	    inet_ntop(AF_INET, &(sin->sin_addr.s_addr), fromip, sizeof(fromip)),
            ntohs((unsigned short)(sin -> sin_port)));
}

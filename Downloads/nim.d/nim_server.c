//Daniel Boos
//Project 4: Nim Server
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include	<signal.h>
#include	<errno.h>
#include	<sys/socket.h>
#include	<netinet/in.h>
#include	<netdb.h>
#include        <arpa/inet.h>

char handles[10][20];
int hlength=0;

void printsin(struct sockaddr_in *, char *, char *);

int main(int argc, char *argv[]) {

//SOCKET FOR DGRAM QUERIES-------------------------------------------------------------
	int d_fd, d_ecode;
	struct sockaddr_in *d_addr;
	struct addrinfo d_hints, *d_addrlist;

	memset(&d_hints, 0, sizeof(d_hints));
	d_hints.ai_family = AF_INET; d_hints.ai_socktype = SOCK_DGRAM;
	d_hints.ai_flags = AI_NUMERICSERV | AI_PASSIVE; d_hints.ai_protocol = 0;
	d_hints.ai_canonname = NULL; d_hints.ai_addr = NULL;
	d_hints.ai_next = NULL;

	d_ecode = getaddrinfo(NULL, "13107", &d_hints, &d_addrlist);
	if (d_ecode != 0) {
	  fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(d_ecode));
	  exit(1);
	}

	d_addr = (struct sockaddr_in *) d_addrlist->ai_addr;

//	printsin(d_addr, "FANCY_RECV_UDP", "Local socket is:"); fflush(stdout);

	d_fd = socket (d_addrlist->ai_family, d_addrlist->ai_socktype, 0);
	if (d_fd < 0) {
	  perror ("fancy_recv_udp:socket");
	  exit (1);
	}

	/*
	   bind port 0x3333 on the current host to the socket accessed through
	   socket_fd. If port in use, die.
	*/
	if (bind(d_fd, (struct sockaddr *)d_addr, sizeof(struct sockaddr_in)) < 0) {
	  perror("fancy_recv_udp:bind");
	  exit(1);
	}

//SOCKET FOR STREAM GAMES----------------------------------------------------------------------
	int s_ecode, listener;  /* fd for socket on which we get connection requests */
	struct sockaddr_in *s_addr;
	struct addrinfo s_hints, *s_addrlist;

	/* 
	   Want to specify local server address of:
	      addressing family: AF_INET
	      ip address:        any interface on this system 
	      port:              0 => system will pick free port
	*/

	memset(&s_hints, 0, sizeof(s_hints));
 	s_hints.ai_family = AF_INET; s_hints.ai_socktype = SOCK_STREAM;
	s_hints.ai_flags = AI_NUMERICSERV | AI_PASSIVE; s_hints.ai_protocol = 0;
 	s_hints.ai_canonname = NULL; s_hints.ai_addr = NULL;
 	s_hints.ai_next = NULL;

	s_ecode = getaddrinfo(NULL, "0", &s_hints, &s_addrlist);
	if (s_ecode != 0) {
	  fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(s_ecode));
	  exit(1);
	}

	s_addr = (struct sockaddr_in *) s_addrlist->ai_addr;
	 
	/*
	   Create socket on which we will accept connections. This is NOT the
	   same as the socket on which we pass data.
	*/
	if ( (listener = socket( s_addrlist->ai_family, s_addrlist->ai_socktype, 0 )) < 0 ) {
	  perror("inet_rstream:socket");
	  exit(1);
	}


	if (bind(listener, (struct sockaddr *)s_addr, sizeof(struct sockaddr_in)) < 0) {
	  perror("inet_rstream:bind");
	  exit(1);
	}

	/*
	   Print out the port number assigned to this process by bind().
	*/
	socklen_t length;
	length = sizeof(struct sockaddr_in);
	if (getsockname(listener, (struct sockaddr *)s_addr, &length) < 0) {
	  perror("inet_rstream:getsockname");
	  exit(1);
	}
	printf("RSTREAM:: assigned port number %d\n", ntohs(s_addr->sin_port));

	/*
	   Now accept a single connection. Upon connection, data will be
	   passed through the socket on descriptor conn.
	*/
	listen(listener,1);

	int conn;      /* fd for socket thru which we pass data */
	struct sockaddr_in peer;
	length = sizeof(peer);

//PUSH THE START BUTTON-------------------------------------------------------------------
	fd_set mask;
	int hits;
	while(1) {
	  FD_ZERO(&mask);
	  FD_SET(0,&mask);
	  FD_SET(d_fd,&mask);
	  FD_SET(listener,&mask);
	  if ((hits = select(listener+1, &mask, (fd_set *)0, (fd_set *)0,
		                 NULL)) < 0) {
	    perror("fancy_recv_udp:select");
	    exit(1);
	  }

//	  IF QUERY
	  if(FD_ISSET(d_fd, &mask)){
	    int cc;
	    struct sockaddr_in from;
	    socklen_t fsize;
	    char  msg[20];
	    fsize = sizeof(from);

//	    RECEIVE DATAGRAM
	    cc = recvfrom(d_fd,&msg,sizeof(msg),0,(struct sockaddr *)&from,&fsize);
	    if (cc < 0) perror("recv_udp:recvfrom");
	    printsin( &from, "recv_udp: ", "Packet from:");
	    printf("Got data ::%s\n",msg);

	    int i;
	    for (i=0; i<hlength; i++){
			int k;
			for(k=0; k<20 && handles[i][k]!='\0';k++){
				printf("%c",handles[i][k]);
			}
			printf("\n");
	    }

//	    SEND DATAGRAM
	    char response[2048];
	    int spot=0;
	    for (i=0;i<hlength;i++){
		int j;
		response[spot]='\n';
		spot++;
		for(j=0;j<20 && handles[i][j]!='\0'; j++){
			response[spot]=handles[i][j];
			printf("response[%d] = handles[%d][%d]\n",spot,i,j);
			printf("response so far: %s",response);
			spot++;
		}
	    }
	    response[spot++]='\0';
	    printf("response so far: %s",response);
	    sendto(d_fd,&response,sizeof(response),0,(struct sockaddr *)&from,fsize);
//	    connect(d_fd, (struct sockaddr *)&from, fsize);
//	    send(d_fd, &response, sizeof(response), 0);
	    fflush(stdout);
	  }

//	IF GAMETIME
	if (FD_ISSET(listener, &mask)){
		if ((conn=accept(listener, (struct sockaddr *)&peer, &length)) < 0) {
		  perror("inet_rstream:accept");
		  exit(1);
		}
		printsin(&peer,"RSTREAM::", "accepted connection from"); 
		printf("\n\nRSTREAM:: data from stream:\n");

		char handle[20]={0};
		char ch='\0';
		int i=0;
		while (read(conn, &ch, 1) == 1 && ch!='\n'){
			handle[i]=ch;
			i++;
		}
		printf("NEW HANDLE!: %s\n", handle);

		for(i=0;i<strlen(handle);i++){
			handles[hlength][i]=handle[i];
		}
		handles[hlength][i+1]='\0';
		hlength++;

		for (i=0; i<hlength; i++){
			int k;
			for(k=0; k<20 && handles[i][k]!='\0';k++){
				printf("%c",handles[i][k]);
			}
			printf("\n");
		}
		if(hlength % 2 == 0){
			printf("SHITS GOING DOWN!\n");
		}
	  }
	}
	exit(1);
}

void printsin(struct sockaddr_in *sin, char *m1, char *m2 )
{
  char fromip[INET_ADDRSTRLEN];

  printf ("%s %s:\n", m1, m2);
  printf ("  family %d, addr %s, port %d\n", sin -> sin_family,
	    inet_ntop(AF_INET, &(sin->sin_addr.s_addr), fromip, sizeof(fromip)),
            ntohs((unsigned short)(sin -> sin_port)));
}

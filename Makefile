all:
	g++ -I/Users/szyma/Projects/mcl/include \
			-L/Users/szyma/Projects/mcl/lib \
			-L/usr/local/opt/openssl/lib \
			-L/usr/local/opt/gmp/lib \
			-lgmp -lgmpxx -lcrypto -lmcl -lmclbn384_256 \
			-fPIC \
			main.cpp -o main 

	# c++ obj/bls12_test.o -o bin/bls12_test.exe lib/libmcl.a -L/usr/local/opt/openssl/lib -L/usr/local/opt/gmp/lib -lgmp -lgmpxx -lcrypto -m64 
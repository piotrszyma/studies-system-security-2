#include <mcl/bls12_381.hpp>

using namespace mcl::bn;


int main(void)
{
  initPairing(mcl::BLS12_381);
	G1 P;
	G2 Q;
	hashAndMapToG1(P, "abc", 3);
	hashAndMapToG2(Q, "abc", 3);

  return 0;
}
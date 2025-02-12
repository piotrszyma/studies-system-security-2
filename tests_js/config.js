const config = {
  ports: {
    PK: 8080,
    PSdomainHTTPS: 8443,
    // local: 8080, Use PSdomainHTTPS
  },
  address: {
    PSdomain: 'pszyma.thenflash.com',
    PKdomain: 'pkawa.thenflash.com',
    PK: '10.8.0.4',
    ABa: '10.8.0.8',
    ABu: '10.8.0.6',
    JZ: '10.8.0.10',
    KS: '10.8.0.9',
    KN: '10.8.0.3',
    LK: '10.8.0.5',
    MP: '10.8.0.11',
    PS: '10.8.0.7',
    RP: '10.8.0.12',
    RR: '10.8.0.2',
    // local: 'localhost', Use PSdomain
  },
  points: {
    g1: {
      x: '3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507',
      y: '1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569',
    },
    g2: {
      x: '2144250947445192081071618466765046647019257686245947349033844530891338159027816696711238671324221321317530545114427',
      y: '2665798332422762660334686159210698639947668680862640755137811598895238932478193747736307724249253853210778728799013',
    }
  },
  consts: {
    r: '0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001',
  }
};

const testedData = {
  testedAddress: config.address.PSdomain,
  testedPort: config.ports.PSdomainHTTPS,
};

const serverConfig = {
  httpPort: 8080,
  httpsPort: config.ports.PSdomainHTTPS,
  address: config.address.PSdomain,
};

module.exports = {
  ...config,
  ...testedData,
  serverConfig,
}
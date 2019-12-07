import SchemeResolver from '../scheme/SchemeResolver';
import EncryptionResolver from '../encryptions/EncryptionResolver';

import SchnorrIdentificationScheme from '../scheme/identification/SchnorrIdentificationScheme';
import OkamotoIdentificationScheme from '../scheme/identification/OkamotoIdentificationScheme';
import ModSchnorrIdentificationScheme from '../scheme/identification/ModSchnorrIdentificationScheme';
import SchnorrSignatureScheme from '../scheme/signature/SchnorrSignatureScheme';
import BLSSignatureScheme from '../scheme/signature/BLSSignatureScheme';
import GochJareckiSignatureScheme from '../scheme/signature/GochJareckiSignatureScheme';
import NaxosKeyExchangeScheme from '../scheme/exchange/NaxosKeyExchangeScheme';
import SigmaKeyExchangeScheme from '../scheme/exchange/SigmaKeyExchangeScheme';
import ChachaEncryption from '../encryptions/ChachaEncryption';
import SalsaEncryption from '../encryptions/SalsaEncryption';

export const schemeResolver = new SchemeResolver();
// Identification schemes.
schemeResolver.register(new SchnorrIdentificationScheme());
schemeResolver.register(new OkamotoIdentificationScheme());
schemeResolver.register(new ModSchnorrIdentificationScheme());

// Signature schemes.
schemeResolver.register(new SchnorrSignatureScheme());
schemeResolver.register(new BLSSignatureScheme());
schemeResolver.register(new GochJareckiSignatureScheme());

// Key exchange.
schemeResolver.register(new NaxosKeyExchangeScheme());
schemeResolver.register(new SigmaKeyExchangeScheme());

export const encryptionResolver = new EncryptionResolver();
encryptionResolver.register(new ChachaEncryption());
encryptionResolver.register(new SalsaEncryption());

import { TpeDataProvider } from './TpeDataProvider.js';
import { KhhDataProvider } from './KhhDataProvider.js';

export class ProviderFactory {
  /**
   * Creates a data provider instance based on airport configuration.
   * @param {Object} airportConfig - Airport configuration object from Airports.js
   * @returns {import('./FlightDataProvider.js').FlightDataProvider}
   */
  static createProvider(airportConfig) {
    if (!airportConfig) {
      throw new Error('Airport configuration is required to create a provider');
    }

    switch (airportConfig.providerType) {
      case 'TPE_CSV':
        return new TpeDataProvider(airportConfig);
      case 'KHH_JSON':
        return new KhhDataProvider(airportConfig);
      default:
        throw new Error(`Unsupported provider type: ${airportConfig.providerType}`);
    }
  }
}

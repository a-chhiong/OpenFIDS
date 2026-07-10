export const airports = {
  tpe: {
    code: 'TPE',
    nameZH: '桃園國際機場',
    nameEN: 'Taoyuan International Airport',
    lat: 25.0797,
    lon: 121.2342,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TPE_CSV',
    apiEndpoints: {
      intl_D: 'https://www.taoyuan-airport.com/uploads/flightx/a_flight_v6.txt',
      intl_A: 'https://www.taoyuan-airport.com/uploads/flightx/a_flight_v6.txt',
      dom_D: null,
      dom_A: null
    },
    logoBaseUrl: 'https://www.taoyuan-airport.com/uploads/airlogo/{code}.gif'
  },
  khh: {
    code: 'KHH',
    nameZH: '高雄國際機場',
    nameEN: 'Kaohsiung International Airport',
    lat: 22.5769,
    lon: 120.3503,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'KHH_JSON',
    apiEndpoints: {
      intl_D: 'https://www.kia.gov.tw/Announce/NewsArea/InstantSchedule_INTDEP.json',
      intl_A: 'https://www.kia.gov.tw/Announce/NewsArea/InstantSchedule_INTARR.json',
      dom_D: 'https://www.kia.gov.tw/Announce/NewsArea/InstantSchedule_DOMDEP.json',
      dom_A: 'https://www.kia.gov.tw/Announce/NewsArea/InstantSchedule_DOMARR.json'
    },
    logoBaseUrl: 'https://www.kia.gov.tw/images/ALL-square/{code}.png'
  },
  rmq: {
    code: 'RMQ',
    nameZH: '臺中國際機場',
    nameEN: 'Taichung International Airport',
    lat: 24.2647,
    lon: 120.6205,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'RMQ_JSON',
    apiEndpoints: {
      intl_D: 'https://www.tca.gov.tw/cht/index.php?act=fids&code=international_l',
      intl_A: 'https://www.tca.gov.tw/cht/index.php?act=fids&code=international_a',
      dom_D: 'https://www.tca.gov.tw/cht/index.php?act=fids&code=domestic_l',
      dom_A: 'https://www.tca.gov.tw/cht/index.php?act=fids&code=domestic_a'
    },
    logoBaseUrl: 'https://www.tca.gov.tw/upload/webstyle_7_default/img/air_logo/{code}.png'
  },
  tsa: {
    code: 'TSA',
    nameZH: '臺北松山機場',
    nameEN: 'Taipei Songshan Airport',
    lat: 25.0697,
    lon: 121.5528,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TSA_JSON',
    apiEndpoints: {
      // Public Open Data API (GET-based, CORS-friendly)
      // https://data.gov.tw/dataset/37242,37248,37317,37319
      intl_D: 'https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?id=42879f51-f47f-4d26-8b2b-5535c652cbde',
      intl_A: 'https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?id=7dc1379a-9485-4491-866d-fc4f9590ffcf',
      dom_D: 'https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?id=c0f7d5b4-ba73-46d2-8485-6595c64c4e17',
      dom_A: 'https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?id=3057d52f-7a71-49e1-a0d4-87ffa3449a6a'
    },
    logoBaseUrl: ''
  }
};

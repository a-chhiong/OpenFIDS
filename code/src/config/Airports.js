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
  }
};

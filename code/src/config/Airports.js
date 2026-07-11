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
      intl_D: 'https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?{query_param}',
      intl_A: 'https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?{query_param}',
      dom_D: 'https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?{query_param}',
      dom_A: 'https://www.tsa.gov.tw/api/publicDataArea/GetFormaterData?{query_param}'
    },
    logoBaseUrl: ''
  },
  mzg: {
    code: 'MZG',
    nameZH: '澎湖機場',
    nameEN: 'Penghu Airport',
    lat: 23.5686,
    lon: 119.6297,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/MZG?$format=JSON',
      intl_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/MZG?$format=JSON',
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/MZG?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/MZG?$format=JSON'
    },
    logoBaseUrl: ''
  },
  knh: {
    code: 'KNH',
    nameZH: '金門機場',
    nameEN: 'Kinmen Airport',
    lat: 24.4297,
    lon: 118.3589,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/KNH?$format=JSON',
      intl_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/KNH?$format=JSON',
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/KNH?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/KNH?$format=JSON'
    },
    logoBaseUrl: ''
  },
  tnn: {
    code: 'TNN',
    nameZH: '臺南機場',
    nameEN: 'Tainan Airport',
    lat: 22.9497,
    lon: 120.2058,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/TNN?$format=JSON',
      intl_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/TNN?$format=JSON',
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/TNN?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/TNN?$format=JSON'
    },
    logoBaseUrl: ''
  },
  ttt: {
    code: 'TTT',
    nameZH: '臺東機場',
    nameEN: 'Taitung Airport',
    lat: 22.7560,
    lon: 121.1011,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/TTT?$format=JSON',
      intl_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/TTT?$format=JSON',
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/TTT?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/TTT?$format=JSON'
    },
    logoBaseUrl: ''
  },
  hun: {
    code: 'HUN',
    nameZH: '花蓮機場',
    nameEN: 'Hualien Airport',
    lat: 24.0270,
    lon: 121.6178,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/HUN?$format=JSON',
      intl_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/HUN?$format=JSON',
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/HUN?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/HUN?$format=JSON'
    },
    logoBaseUrl: ''
  },
  lzn: {
    code: 'LZN',
    nameZH: '馬祖南竿機場',
    nameEN: 'Matsu Nangan Airport',
    lat: 26.1561,
    lon: 119.9583,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: null,
      intl_A: null,
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/LZN?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/LZN?$format=JSON'
    },
    logoBaseUrl: ''
  },
  mfk: {
    code: 'MFK',
    nameZH: '馬祖北竿機場',
    nameEN: 'Matsu Beigan Airport',
    lat: 26.2239,
    lon: 119.9972,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: null,
      intl_A: null,
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/MFK?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/MFK?$format=JSON'
    },
    logoBaseUrl: ''
  },
  cyi: {
    code: 'CYI',
    nameZH: '嘉義機場',
    nameEN: 'Chiayi Airport',
    lat: 23.4619,
    lon: 120.3867,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: null,
      intl_A: null,
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/CYI?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/CYI?$format=JSON'
    },
    logoBaseUrl: ''
  },
  hcn: {
    code: 'HCN',
    nameZH: '恆春機場',
    nameEN: 'Hengchun Airport',
    lat: 22.0417,
    lon: 120.7303,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: null,
      intl_A: null,
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/HCN?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/HCN?$format=JSON'
    },
    logoBaseUrl: ''
  },
  gdo: {
    code: 'GDO',
    nameZH: '綠島機場',
    nameEN: 'Green Island Airport',
    lat: 22.6738,
    lon: 121.4651,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: null,
      intl_A: null,
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/GDO?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/GDO?$format=JSON'
    },
    logoBaseUrl: ''
  },
  kyd: {
    code: 'KYD',
    nameZH: '蘭嶼機場',
    nameEN: 'Lanyu Airport',
    lat: 22.0298,
    lon: 121.5332,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: null,
      intl_A: null,
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/KYD?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/KYD?$format=JSON'
    },
    logoBaseUrl: ''
  },
  cmj: {
    code: 'CMJ',
    nameZH: '七美機場',
    nameEN: 'Qimei Airport',
    lat: 23.2128,
    lon: 119.4290,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: null,
      intl_A: null,
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/CMJ?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/CMJ?$format=JSON'
    },
    logoBaseUrl: ''
  },
  wot: {
    code: 'WOT',
    nameZH: '望安機場',
    nameEN: 'Wang-an Airport',
    lat: 23.3686,
    lon: 119.5019,
    utcOffset: 8,
    defaultFrom: -1,
    defaultTo: 6,
    providerType: 'TDX',
    apiEndpoints: {
      intl_D: null,
      intl_A: null,
      dom_D: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/WOT?$format=JSON',
      dom_A: 'https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Arrival/WOT?$format=JSON'
    },
    logoBaseUrl: ''
  }
};

  function doGet() {
    var htmloutput = HtmlService.createTemplateFromFile('Page').evaluate();
    htmloutput.setTitle('天気予報ノート').addMetaTag('viewport', 'width=device-width, initial-scale=1');
    return htmloutput;
  }

  function areaList(areaIndex) {
    var area_list;
    switch (areaIndex) {
      case 0:
        area_list = {
          '1': '未選択'
        }
        break;
      case 1:
        area_list = {
          '2': '道北',
          '3': '道東',
          '4': '道南',
          '5': '道央'
        }
        break;
      case 2:
        area_list = {
          '6': '青森県',
          '7': '岩手県',
          '8': '宮城県',
          '9': '秋田県',
          '10': '山形県',
          '11': '福島県'
        }
        break;
      case 3:
        area_list = {
          '12': '茨城県',
          '13': '栃木県',
          '14': '群馬県',
          '15': '埼玉県',
          '16': '千葉県',
          '17': '東京都',
          '18': '神奈川県'
        }
        break;
      case 4:
        area_list = {
          '19': '新潟県',
          '20': '富山県',
          '21': '石川県',
          '22': '福井県',
          '23': '山梨県',
          '24': '長野県'
        }
        break;
      case 5:
        area_list = {
          '25': '岐阜県',
          '26': '静岡県',
          '27': '愛知県',
          '28': '三重県'
        }
        break;
      case 6:
        area_list = {
          '29': '滋賀県',
          '30': '京都府',
          '31': '大阪府',
          '32': '兵庫県',
          '33': '奈良県',
          '34': '和歌山県'
        }
        break;
      case 7:
        area_list = {
          '35': '鳥取県',
          '36': '島根県',
          '37': '岡山県',
          '38': '広島県',
          '39': '山口県'
        }
        break;
      case 8:
        area_list = {
          '40': '徳島県',
          '41': '香川県',
          '42': '愛媛県',
          '43': '高知県'
        }
        break;
      case 9:
        area_list = {
          '44': '福岡県',
          '45': '佐賀県',
          '46': '長崎県',
          '47': '熊本県',
          '48': '大分県',
          '49': '宮崎県',
          '50': '鹿児島県',
          '51': '沖縄県'
        }
        break;
      default:
        area_list = {
          '0': 'Eroor!'
        }
        break;
    }
    return area_list;
  }

  function setPoint(areaName) {
    var area_list = {};
    var spreadsheet = SpreadsheetApp.openById('1_yHDjFit6ouKKQ4bsE6n_Kn8o-qfk6GTx3DrAf3WEqM');
    var sheet = spreadsheet.getSheetByName('Value');
    var ich = sheet.getRange(areaName, 1, 1, 2).getValues();
    var ss = ich[0][0];
    var j = ich[0][1] - ich[0][0] + 1;
    Logger.log(ich);
    sheet = spreadsheet.getSheetByName('Point');
    var range = sheet.getRange(ss, 1, j, 2).getValues();
    for (var i = 0; i < j; i++) {
      area_list[sheet.getRange(ss + i, 2, 1, 1).getValue()] = sheet.getRange(ss + i, 1, 1, 1).getValue();
    }
    Logger.log(area_list);
    return area_list;
  }


  function getJson(point) {
    point = '' + point;

    var data = UrlFetchApp.fetch('http://weather.livedoor.com/forecast/webservice/json/v1?city=' + point);
    var json = JSON.parse(data.getContentText());
    Logger.log(json);
    var text = makeText(json);
    return text;
  }

  function makeText(json) {
    var titlis = [
      ['today_date', 'today_weather', 'today_high', 'today_low'],
      ['tommorow_date', 'tommorow_weather', 'tommorow_high', 'tommorow_low'],
      ['tommorows_date', 'tommorows_weather', 'tommorows_high', 'tommorows_low']
    ];
    var strBox = {};
    var hightem;
    var lowtem;
    //天気取得位置
    strBox['location'] = json['title'];

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 4; j++) {
        switch (j) {
          case 0: //日付
            strBox[titlis[i][j]] = json['forecasts'][i]['date'];
            break;
          case 1: //天気
            strBox[titlis[i][j]] = '天気：' + json['forecasts'][i]['telop'];
            break;
          case 2: //最高気温
            if (json['forecasts'][i]['temperature']['max'] == null)
              hightem = 'データ無し';
            else
              hightem = json['forecasts'][i]['temperature']['max']['celsius'];
            strBox[titlis[i][j]] = '最高気温：' + hightem;
            break;
          case 3: //最低気温
            if (json['forecasts'][i]['temperature']['min'] == null)
              lowtem = 'データ無し';
            else
              lowtem = json['forecasts'][i]['temperature']['min']['celsius'];
            strBox[titlis[i][j]] = '最低気温：' + lowtem;
            break;
        }
      }
    }
    strBox['text'] = json['description']['text'];
    //発表日時
    strBox['announce'] = '発表日時：' + json['description']['publicTime'];
    //サイトのリンク
    strBox['link'] = json['link'];
    return strBox;
  }

  function sendMail(str, address) {
    //メール送信
    var title = '【天気取得結果】';
    GmailApp.sendEmail(address, title, str); //アドレス、タイトル、本文
    //以下HTMLに置いていた要素
    /*<form class='mail'>
        メールで送る
        <input type='email' id='mail_address'>
        <input type='button' value='メール送信' onclick='MailButton()'>
        </form>*/

  }
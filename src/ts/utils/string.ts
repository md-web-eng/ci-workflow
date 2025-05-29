/**
 *  htmlエスケープ
 *  @param str string
 */
export const EscapeHTML = (str: string): string => {
  let result = '';
  result = str.replace('&', '&amp;');
  result = str.replace("'", '&#x27;');
  result = str.replace('`', '&#x60;');
  result = str.replace('"', '&quot;');
  result = str.replace('<', '&lt;');
  result = str.replace('>', '&gt;');
  result = str.replace(/\n/, '<br>');

  return result;
};

/**
 *  serialize
 *  @param data object
 */
export const Serialize = (data: object): string => {
  let key: string;
  let value: string;
  let type: string;
  let i: number;
  let max: number;
  const encode = window.encodeURIComponent;
  let query: string = '?';

  for (key of Object.keys(data)) {
    // @ts-ignore
    value = data[key];
    type = typeof value === 'object' && true ? 'array' : typeof value;
    switch (type) {
      case 'undefined':
        // キーのみ
        query += key;
        break;
      case 'array':
        // 配列
        for (i = 0, max = value.length; i < max; i += 1) {
          query += `${key}[]`;
          query += '=';
          // @ts-ignore
          query += encode(value[i]);
          query += '&';
        }
        query = query.substr(0, query.length - 1);
        break;
      case 'object':
        // ハッシュ
        // @ts-ignore
        for (i of Object.keys(value)) {
          query += `${key}[${i}]`;
          query += '=';
          // @ts-ignore
          query += encode(value[i]);
          query += '&';
        }
        query = query.substr(0, query.length - 1);
        break;
      default:
        query += key;
        query += '=';
        query += encode(value);
        break;
    }
    query += '&';
  }
  query = query.substr(0, query.length - 1);
  return query;
};

/**
 * クエリ文字列をオブジェクトに変換して返す
 * @param url: string
 * @returns Record<string, string>
 */
export const GetUrlVars = (): Record<string, string> => {
  const vars: Record<string, string> = {};
  const url = window.location.search;
  const hash: string[] = url.slice(1).split('&');
  const max: number = hash.length;
  for (let i = 0; i < max; i += 1) {
    const [key, value]: string[] = (hash[i] as string).split('='); // key and value are split.
    if (key !== '') {
      // @ts-ignore
      vars[key] = value; // assign value to key.
    }
  }
  return vars;
};

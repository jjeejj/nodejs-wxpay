import axios from "axios";
// import * as fs from "fs";
import { HttpDelegate } from "./HttpKit";
import * as https from "https";
// import concat from "concat-stream";

export class AxiosHttpKit implements HttpDelegate {
  httpGet(url: string, options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .get(url, options)
        .then(response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(`error code ${response.status}`);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  httpGetToResponse(url: string, options?: any): Promise<any> {
    return new Promise(resolve => {
      axios
        .get(url, options)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          resolve(error.response);
        });
    });
  }

  httpPost(url: string, data: string, options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, options)
        .then(response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(`error code ${response.status}`);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  httpPostToResponse(url: string, data: string, options?: any): Promise<any> {
    return new Promise(resolve => {
      axios
        .post(url, data, options)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          resolve(error.response);
        });
    });
  }

  httpPutToResponse(url: string, data: string, options?: any): Promise<any> {
    return new Promise(resolve => {
      axios
        .put(url, data, options)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          resolve(error.response);
        });
    });
  }

  httpDeleteToResponse(url: string, options?: any): Promise<any> {
    return new Promise(resolve => {
      axios
        .delete(url, options)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          resolve(error.response);
        });
    });
  }

  httpPostWithCert(url: string, data: string, certFileContent: Buffer, passphrase: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let httpsAgent = new https.Agent({
        pfx: certFileContent,
        passphrase,
      });

      axios
        .post(url, data, { httpsAgent })
        .then(response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(`error code ${response.status}`);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

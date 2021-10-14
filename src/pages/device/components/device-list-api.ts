import { useState, useEffect } from 'react';
import api from '../../../_api/backend/index';

export default function DeviceListAPI(
  type: string,
  searKeyPress: string,
  page: any,
  keyUpReset: any
) {
  const [loading, setLoading] = useState<Boolean>(true);
  const [searchDevices, setSearchDevices] = useState<any[]>([]);
  const [deviceListCheck, setDeviceListCheck] = useState<Boolean>(true);

  useEffect(() => {
    setSearchDevices([]);
  }, [searKeyPress, keyUpReset]);

  useEffect(() => {
    setLoading(true);
    fetchDevicesList();
  }, [searKeyPress, page, keyUpReset]);

  // 장비 리스트 api 호출
  const fetchDevicesList = () => {
    api
      .getDevicesForList(type, searKeyPress, page, 10)
      .then((payload: any) => {
        if (payload.response.results !== null) {
          const { code, response } = payload;
          if (code === 200 && response && Array.isArray(response.results)) {
            console.log(`fetchList >> `, payload);
            setSearchDevices((prevList: any) => {
              return [...prevList, response];
            });
            setLoading(false);
          } else {
            setSearchDevices([]);
          }
        }
        if (payload.response.count < 1) {
          setDeviceListCheck(true);
        }
      })
      .catch(() => {
        console.log('PAGING ERROR');
      });
  };

  return { loading, searchDevices, deviceListCheck };
}

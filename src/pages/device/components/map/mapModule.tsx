/* eslint-disable dot-notation */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import api from '../../../../_api/backend';

const mapStyle = {
  width: '100%',
  height: '100%',
};

const marker1 = {
  style: 'circle',
  radius: 5,
  fillColor: 'red',
  fillOpacity: 1,
  strokeColor: 'black',
  strokeStyle: 'solid',
  strokeWeight: 3,
};
const marker2 = {
  style: 'circle',
  radius: 15,
  fillColor: 'blue',
  fillOpacity: 1,
  strokeColor: 'black',
  strokeStyle: 'solid',
  strokeWeight: 3,
};
/*
marker3 = {
  content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(../images/cluster-marker-4.png);background-size:contain;"></div>',
  size: N.Size(40, 40),
  anchor: N.Point(20, 20)
},
marker4 = {
  url: 'http://static.naver.net/maps/img/icons/sp_pins_default_v3_over.png',
  size: new naver.maps.Size(24, 37),
  origin: new naver.maps.Point(90, 0),
  anchor: new naver.maps.Point(12, 37)
},
marker5 = {
  content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(../images/cluster-marker-5.png);background-size:contain;"></div>',
  size: N.Size(40, 40),
  anchor: N.Point(20, 20)
},
*/

// 주석처리 작업 이어나가야함.
export const MapModule = (props: any) => {
  const [devicesForMap, setDevicesForMap] = useState<any[]>([]);
  const [naverMap, setNaverMap] = useState<naver.maps.Map>();
  const [markerCluster, setMarkerCluster] = useState<any>();
  const [clusterListener, setClusterListener] = useState<any>();

  useEffect(() => {
    fetchDevices(mapCorrd(36.8169675, 127.1056431), '1');
    setDefaultMapSetting();
  }, []);

  useEffect(() => {
    mapMarkerSetting();
  }, [devicesForMap]);

  const fetchDevices = (corrd: string, radius: string) => {
    console.log(`fetchDevices : coord: ${corrd}, radius: ${radius}`);
    api.getDevicesForMap(corrd, radius).then((payload: any) => {
      const { code, response } = payload;
      if (code === 200 && response && Array.isArray(response.results)) {
        const ret = response.results.filter((item: any): boolean => item.type === 'CCTV');
        setDevicesForMap(ret);
        console.log(ret);
      }
    });
  };

  const mapCorrd = (mapLat: number, mapLng: number) => {
    if (mapLat <= 0 || mapLng <= 0) {
      return '';
    }

    return `${mapLat.toString()} ${mapLng.toString()}`;
  };

  function changeMarkerClusterEvent(cluster: any[], clusterMarker: any, count: number) {
    $(clusterMarker.getElement()).find('div:first-child').text(count);

    if (clusterListener) {
      naver.maps.Event.removeListener(clusterListener);
    }

    const listener = naver.maps.Event.addListener(clusterMarker, 'click', () => {
      const items = devicesForMap.filter((item) => {
        for (let i = 0; i < cluster.length; i++) {
          if (item.item_uuid === cluster[i].title) {
            return true;
          }
        }
        return false;
      });
      markerClicked(items);
    });
    setClusterListener(listener);
  }

  const setDefaultMapSetting = () => {
    const lng = Number(process.env.REACT_APP_MAP_INIT_LNG);
    const lat = Number(process.env.REACT_APP_MAP_INIT_LAT);
    const initZoom = Number(process.env.REACT_APP_MAP_INIT_ZOOM);

    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat, lng),
      zoom: initZoom,
      maxZoom: 15,
    });

    const markerClustering = new MarkerClustering({
      minClusterSize: 2,
      maxZoom: 15,
      map: map,
      disableClickZoom: true,
      averageCenter: true,
      gridSize: 50,
      icons: [marker1, marker2],
      indexGenerator: [10, 100, 200, 500, 1000],
    });

    setMarkerCluster(markerClustering);

    naver.maps.Event.addListener(map, 'bounds_changed', function () {
      fetchDevices(
        mapCorrd(
          (map.getBounds() as naver.maps.LatLngBounds).getCenter().lat(),
          (map.getBounds() as naver.maps.LatLngBounds).getCenter().lng()
        ),
        '1.5'
      );
      console.log(`bound : `, map.getBounds().getCenter());
    });

    setNaverMap(map);
  };

  const markerClicked = (event: any) => {
    const arr = event;
    props.onClicked(arr);
  };

  const mapMarkerSetting = () => {
    const markers: naver.maps.Marker[] = [];
    for (let i = 0; i < devicesForMap.length; i++) {
      const marker = new naver.maps.Marker({
        title: devicesForMap[i].item_uuid,
        position: new naver.maps.LatLng(devicesForMap[i].latitude, devicesForMap[i].longitude),
        zIndex: 100,
      });

      marker.setMap(null);

      naver.maps.Event.addListener(marker, 'click', () => {
        markerClicked(devicesForMap.filter((item) => item.item_uuid === marker.getTitle()));
      });
      markers.push(marker);
    }

    if (markerCluster) {
      (markerCluster as any).setStylingFunction(changeMarkerClusterEvent);
      (markerCluster as any).setMarkers(markers);
      (markerCluster as any).onUpdate();
    }
  };

  return (
    <>
      <div id="map" style={mapStyle} />
    </>
  );
};

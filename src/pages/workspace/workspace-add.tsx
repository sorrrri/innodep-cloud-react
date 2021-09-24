/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { Modal } from '../../_component/modal-confirm';
import { ModalDone } from '../../_component/modal-done';
import { showHeader } from '../../_store/slice/header-option';
import api from '../../_api/backend';

export function WorkspaceAdd(props: any) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showToList, setShowToList] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showCatch, setShowCatch] = useState(false);

  const [recipient, setRecipient] = useState<any[]>([]); // 받는사람 정보

  // 일감 등록
  const [title, setTitle] = useState(''); // 작업명
  const [priority, setPriority] = useState('EMERGENCY'); // 중요도
  const [detailType, setDetailType] = useState('WORK_PERMISSION'); // 업무유형
  const [toList, setToList] = useState<any[]>([]); // 받는사람
  const [platformSharing, setPlatformSharing] = useState(true); // 플랫폼관리자 공개여부
  const [content, setContent] = useState(''); // 작업내용
  const [attacheFiles, setAttacheFiles] = useState<File[]>([]); // 파일첨부

  useEffect(() => {
    dispatch(
      showHeader({
        title: '업무 요청',
        leftContextType: 'back',
        rightContext: () => null,
      })
    );
    fetchWorkspaceTemplate();
  }, []);

  // 받는사람 정보 get
  const fetchWorkspaceTemplate = () => {
    api.getWorkspaceTemplate().then((payload: any) => {
      const { code, response } = payload;
      if (code === 200 && Array.isArray(response.results.recipient)) {
        setRecipient(response.results.recipient);
      }
    });
  };

  console.log(recipient);

  // 받는사람 filter / select2로 html변경 후 재작업 필요
  // const handleInputName = (e: any) => {
  //   const arrayName = e.target.value.split(';');
  //   const tolistresult = [];
  //   for (let i = 0; i < arrayName.length; i++) {
  //     const filtername = recipient.filter((item) => item.name === arrayName[i]);
  //     const filteruuid = filtername.map((item) => item.uuid);
  //     tolistresult.push(filteruuid);
  //   }
  //   setToList(tolistresult);
  //   fetchWorkspaceTemplate();
  // };

  const showModal = () => {
    // if (title === '') {
    //   setShowTitle(true);
    // } else if (toList.length === 0) {
    //   setShowToList(true);
    // } else if (content === '') {
    //   setShowContent(true);
    // } else {
    setIsOpen(true);
    // }
  };

  // 업무 요청 등록
  const showDoneModal = () => {
    api
      .addWorkspace('work', {
        title: '업무 요청 등록',
        priority: 'HIGH',
        detail_type: 'WORK_ETC',
        to_list: '6bf44769-1af3-4d0b-b9df-a8a5ba8ae8de',
        platform_sharing: false,
        content: '내용 = 업무 요청 등록',
        upload_files: attacheFiles,
      })
      .catch(() => {
        setIsOpen(false);
        // setShowCatch(true);
      });
    setIsOpen2(true);
  };

  const isClose = () => {
    setIsOpen(false);
  };

  const isClose2 = () => {
    setIsOpen2(false);
    const { history } = props;
    history.push('/workspace');
  };

  const options = [
    { value: 'qkrqhrja', label: '박보검1' },
    { value: 'wjswlgus', label: '전지현2' },
    { value: 'wjddntjd', label: '정우성3' },
  ];

  const [test, setdrtest] = useState();
  console.log(test);

  return (
    <>
      <main className="content details add workspace">
        <div className="inputs">
          <div className="input title">
            <span>작업명</span>
            <input
              type="text"
              placeholder="작업명을 입력하세요."
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="input">
            <span>중요도</span>
            <div className="filters">
              <button type="button">
                <input
                  type="radio"
                  id="input-emergency"
                  name="filter-importance"
                  defaultChecked
                  onClick={() => setPriority('EMERGENCY')}
                />
                <label htmlFor="input-emergency">
                  <span>긴급</span>
                </label>
              </button>
              <button type="button">
                <input
                  type="radio"
                  id="input-high"
                  name="filter-importance"
                  onClick={() => setPriority('HIGH')}
                />
                <label htmlFor="input-high">
                  <span>높음</span>
                </label>
              </button>
              <button type="button">
                <input
                  type="radio"
                  id="input-normal"
                  name="filter-importance"
                  onClick={() => setPriority('USUALLY')}
                />
                <label htmlFor="input-normal">
                  <span>보통</span>
                </label>
              </button>
              <button type="button">
                <input
                  type="radio"
                  id="input-low"
                  name="filter-importance"
                  onClick={() => setPriority('LOW')}
                />
                <label htmlFor="input-low">
                  <span>낮음</span>
                </label>
              </button>
            </div>
          </div>
          <div className="input">
            <span>업무유형</span>
            <div className="filters work-type">
              <button type="button">
                <input
                  type="radio"
                  id="request-permission"
                  name="work-type"
                  defaultChecked
                  onClick={() => setDetailType('WORK_PERMISSION')}
                />
                <label htmlFor="request-permission">
                  <span>권한요청</span>
                </label>
              </button>
              <button type="button">
                <input
                  type="radio"
                  id="personal-information"
                  name="work-type"
                  onClick={() => setDetailType('MODIFY_INFO')}
                />
                <label htmlFor="personal-information">
                  <span>개인정보변경</span>
                </label>
              </button>
              <button type="button">
                <input
                  type="radio"
                  id="reset-password"
                  name="work-type"
                  onClick={() => setDetailType('RESET_PASSWORD')}
                />
                <label htmlFor="reset-password">
                  <span>비밀번호 초기화</span>
                </label>
              </button>
              <button type="button">
                <input
                  type="radio"
                  id="etc"
                  name="work-type"
                  onClick={() => setDetailType('WORK_ETC')}
                />
                <label htmlFor="etc">
                  <span>기타</span>
                </label>
              </button>
            </div>
          </div>
          <div className="input send-to">
            <span>받는사람</span>
            <Select
              placeholder="이름을 입력하세요."
              // defaultValue={selectedOption}
              options={options}
              onChange={(option: any) => setdrtest(option)}
              isMulti
            />
            {/* <input type="text" onChange={handleInputName} /> */}
          </div>
          <div className="input">
            <span>플랫폼관리자 공개여부</span>
            <div className="filters">
              <button type="button">
                <input
                  type="radio"
                  id="content-public"
                  name="content-type"
                  defaultChecked
                  onClick={() => setPlatformSharing(true)}
                />
                <label htmlFor="content-public">
                  <span>예</span>
                </label>
              </button>
              <button type="button">
                <input
                  type="radio"
                  id="content-private"
                  name="content-type"
                  onClick={() => setPlatformSharing(false)}
                />
                <label htmlFor="content-private">
                  <span>아니오</span>
                </label>
              </button>
            </div>
          </div>
          <textarea name="" id="" onChange={(e) => setContent(e.target.value)} />
          <div className="buttons attach">
            <button type="button">
              <input
                type="file"
                id="input-attach"
                multiple
                onChange={(e: any) => setAttacheFiles(Array.from(e.target.files))}
              />
              <label htmlFor="input-attach">
                <i className="fad fa-cloud-upload" />
              </label>
            </button>
          </div>
          {attacheFiles.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ul key={index} className="files-name">
              <li>{item.name}</li>
            </ul>
          ))}
        </div>
      </main>
      <div className="buttons">
        <button className="btn-main" onClick={showModal} type="button">
          업무 요청 등록
        </button>
      </div>

      <ModalDone show={showTitle} close={() => setShowTitle(false)}>
        작업명을 입력해 주세요.
      </ModalDone>
      <ModalDone show={showToList} close={() => setShowToList(false)}>
        받는사람을 입력해 주세요.
      </ModalDone>
      <ModalDone show={showContent} close={() => setShowContent(false)}>
        댓글을 입력해 주세요.
      </ModalDone>
      <ModalDone show={showCatch} close={() => setShowCatch(false)}>
        업무 요청 등록 실패, 관리자에게 문의해주시기 바랍니다.
      </ModalDone>
      <Modal show={isOpen} confirmed={showDoneModal} close={isClose} title="업무 요청">
        업무 요청을 등록하시겠습니까?
      </Modal>
      <ModalDone show={isOpen2} close={isClose2}>
        업무 요청이 등록 되었습니다.
      </ModalDone>
    </>
  );
}

<p align="center">
  <img width="400" height="129" alt="Group 18" src="https://github.com/user-attachments/assets/727d0bc2-3166-413e-b031-eb07d4993454" />
</p>

<div align='center'>
  
## 🚇 서비스 소개
  
**METRO**는 외부 라이브러리에 의존하지 않고 **직접 구현**한 블록 기반 웹 에디터로, 

폴더 구조와 지하철 노선도와 비슷한 시각화를 통해 아이디어를 체계적으로 정리할 수 있는 메모 서비스입니다.

 <h4>
      <a><del>🌏 서비스</del></a> | 
      <a href='https://nine-income-43f.notion.site/Metro-1619d29069ce801b870decd2aa441280?source=copy_link'>📓 팀 노션</a> | 
      <a href='https://github.com/orgs/DevB33/projects/1'>🧾 백로그</a> | 
      <a href='https://devb33.github.io/metro-server/src/main/resources/docs/index.html'>🔄 API Docs</a>
    </h4>

</div>

<br />

## 📱 기능 소개

### 폴더구조의 노트정리

> 자신만의 노트들을 폴더 구조를 통해 효율적으로 정리할 수 있습니다.

<table>
  <tr>
    <td align="center">
      <h3>노트 생성</h3>
      <img src="https://github.com/user-attachments/assets/44c0e180-4aed-4df0-b36f-6381e4f9daf3" width="380" />
    </td>
    <td align="center">
      <h3>노트 순서 변경</h3>
      <img src="https://github.com/user-attachments/assets/7fa0f6e8-c635-435a-afc4-1a7ad291cb90" width="380" />
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <h3>노트 수정</h3>
      <img src="https://github.com/user-attachments/assets/e841f817-ce46-4341-a8a7-d43bf4c2ee16" width="800" />
    </td>
  </tr>
</table>

<br />

### 지하철 노선도 형태로 시각화

> 폴더 구조로 정리된 노트들을 지하철 노선도 형태의 그래프로도 확인할 수 있습니다.

<table>
  <tr>
    <td align="center" colspan="2">
      <h3>두 가지 형태의 노선도 시각화</h3>
      <img src="https://github.com/user-attachments/assets/56a99f29-a623-4ea4-8260-97c640fd4444" width="800" />
    </td>
  </tr>
</table>

<br />

### 에디터

**노트 헤더 커스텀**
> 노트의 아이콘, 커버, 제목, 태그 등을 직접 설정할 수 있습니다.

<br />

<table>
  <tr>
    <td align="center" colspan="2">
      <h3>아이콘 & 커버 수정</h3>
      <img src="https://github.com/user-attachments/assets/43038c8a-1c69-46a3-8e0c-cc34375dd3e0" width="800" />
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <h3>태그 수정</h3>
      <img src="https://github.com/user-attachments/assets/c94b50a5-5e5b-4f00-85cb-6ef162718ec4" width="800" />
    </td>
  </tr>
</table>

<br />

**블록 기반 에디터**
> 노트 내용을 블록 단위로 구성하고 편집할 수 있습니다.

<br />

<table>
   <tr>
    <td align="center" colspan="2">
      <h3>타이핑 중 엔터</h3>
      <img src="https://github.com/user-attachments/assets/034bda65-93b0-4de6-8156-4838985f84ae" width="800" />
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <h3>블록 타입 변경</h3>
      <img src="https://github.com/user-attachments/assets/ed0eea7c-cbc9-4f7a-80cc-1a989ba4ec28" width="800" />
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <h3>블록 순서 변경</h3>
      <img src="https://github.com/user-attachments/assets/1e65f363-3d41-4d92-b2d3-7d1a50a77007" width="800" />
    </td>
  </tr>
</table>

<br />

**가상 셀렉션**
> 가상 셀렉션을 통해 블록 단위로 범위 입력, 수정, 삭제 등을 할 수 있습니다.

<br />

<table>
   <tr>
    <td align="center" colspan="2">
      <h3>셀렉션 범위 삭제 및 입력</h3>
      <img src="https://github.com/user-attachments/assets/8399f0b8-9931-47f7-85b7-5817790522b2" width="800" />
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <h3>셀렉션 범위 스타일 변경</h3>
      <img src="https://github.com/user-attachments/assets/dfeb9107-59ae-4896-91eb-7ca7ab0ccd63" />
    </td>
  </tr>
</table>

<br />

## 🛠️ 에디터를 직접 구현하기 위한 노력

### contentEditable의 DOM 조작과 리액트의 vDOM 충돌

- 처음에는 textarea를 사용하여 블록 단위의 입력을 구현하려 했으나, 블록 내 개별 항목들을 유연하게 다루기 어려운 문제가 있었습니다.
- 이를 해결하기 위해 contentEditable을 활용하는 방법을 알게 되었고, 보다 유연한 구성과 블록 기반의 에디터 구조를 구현할 수 있어 contentEditable로 변경하게 되었습니다.
- 이때 textarea와 다르게 contentEditalbe은 **DOM**을 직접조작하고, 리액트가 상태변경을 보고 만든 **vDOM**과 충돌하면서 문제가 발생했습니다.

<img width="1214" height="753" alt="KakaoTalk_Photo_2025-09-28-16-05-12" src="https://github.com/user-attachments/assets/2d48b86c-2ba3-4b37-9d9a-01c0f9097bcd" />

- 위 문제를 해결하기 위해서 다른 프로젝트에서는 이 문제를 해결하기 위해 **MobX**라는 상태 라이브러리를 사용하여 상태를 추적하는 방식을 사용했습니다.
- 그러나 MobX는 **상태관리를 위한 라이브러리**이고, 저희는 별도의 상태관리 라이브러리가 필요하지 않아 React의 memo를 활용하여 문제를 해결했습니다.

<img width="995" height="818" alt="KakaoTalk_Photo_2025-09-28-16-05-18" src="https://github.com/user-attachments/assets/c64ae268-d830-4a5c-89ae-dca8893d100c" />

더 자세한 문제 상황과 해결 방법은 아래 링크에 정리해 두었습니다.

[⭐ contentEditable의 DOM 조작과 리액트의 vDOM 충돌 문제 해결](https://nine-income-43f.notion.site/contentEditable-DOM-vDOM-1939d29069ce80e49d5ae40dd2957b80)

---

### 가상셀렉션

- 블록 간의 수정 및 삭제 등 기능 개발을 위해 여러 블록을 드래그로 선택할 수 있어야 했습니다.
- 브라우저 기본 SelectionAPI는 하나의 요소에서만 작동합니다. 하지만 블록 기반 텍스트 에디터에서는 각 블록이 독립적인 컴포넌트로 나뉘어져 있어 selection이 끊기게 됩니다.
- 해결 방법을 찾던 중, 자체 제작된 에디터들은 브라우저 기본 selection 대신 가상 selection을 만들어 사용한다는 사실을 알게 되었고, 저희도 이를 구현하기로 했습니다.

**가상 selection 구현 전략**

1. 마우스로 여러 블록을 드래그해서 선택
2. 실시간으로 선택된 블록에 배경 표시

<img width="1632" height="603" alt="스크린샷 2025-05-23 오전 11 20 00" src="https://github.com/user-attachments/assets/91793922-b741-41c4-9536-02dc5604d4dc" />
<img width="1636" height="616" alt="스크린샷 2025-05-23 오전 11 20 04" src="https://github.com/user-attachments/assets/6e5c8982-e448-4f84-b9b4-41d87ce5cd88" />

이러한 과정을 거쳐 가상 셀렉션을 구현하게 되었으며, 그 과정에서 여러 가지 문제점들이 발생했습니다. 각각의 문제와 이를 해결한 방법은 아래 링크에 정리해 두었습니다.

[⭐ 블록 기반 에디터에서 가상 selection 구현하기](https://nine-income-43f.notion.site/selection-1f19d29069ce80448976d4a68fbaea1f#1fc9d29069ce80b1b64eed2256633f79)

<br />

이 외에도 여러 기술적 도전에 대한 문서들을 아래 링크에 정리해 두었습니다.

[🐾 Metro 개발 문서](https://nine-income-43f.notion.site/1659d29069ce8170a04bd350387ac6e3?source=copy_link)

<br />

## ⚙️ 기술스택

`TypeScript`  `Next.js`  
<br />
`panda css` `Axios`  `SWR` `visx`

<br />

## 🫂 팀원 소개

<div align="center">
  
|김기원|이동율|이준석|오민석|
|:--:|:--:|:--:|:--:|
|<a href="https://github.com/kiuuon"><img src="https://avatars.githubusercontent.com/u/74997112?v=4" width="150px;" alt=""/></a>|<a href="https://github.com/leedongyull"><img src="https://avatars.githubusercontent.com/u/75784807?v=4" width="150px;" alt=""/></a>|<a href="https://github.com/ljs831"><img src="https://avatars.githubusercontent.com/u/127804419?v=4" width="150px;" alt=""/></a>|<a href="https://github.com/minseok-oh"><img src="https://avatars.githubusercontent.com/u/68336833?v=4" width="150px;" alt=""/></a>|
|FE|FE|FE|BE|
|<a href="https://github.com/kiuuon">@kiuuon</a>|<a href="https://github.com/leedongyull">@leedongyull</a>|<a href="https://github.com/ljs831">@ljs831</a>|<a href="https://github.com/minseok-oh">@minseok-oh</a>|

</div>

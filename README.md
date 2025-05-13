# 멜론 취켓팅 자동화 스크립트

멜론 티켓의 취켓팅을 자동화 하는 스크립트입니다.

속도 조절이 가능하나 적절하게 조절해두었으니 수정이 필요없습니다.

## 사용방법
### 랜덤 모드 ( run_random.js )
``` 열린 좌석 모두를 선택하는 모드입니다. ```
1. 취켓팅 원하는 공연 예매 접속
2. (선택) 좌석이 아닌 구역이 있다면 원하는 구역까지 클릭
3. 보안문자[캡차] 입력
4. F12 -> Console -> 스크립트 붙여넣기
5. 정지 원할경우 Console창에 stop() 입력

### 타겟팅 모드 ( run_targeting.js )
``` 특정 좌석만 선택하는 모드입니다. ```
1. 취켓팅 원하는 공연 접속
2. 좌석 색상표 위치까지 스크롤
3. F12 -> 좌측상단 아이콘 클릭 ( 핫키 Ctrl + Shift + C )
4. 원하는 좌석의 색상코드 확인

![Guide Image](https://github.com/KnifeLemon/melon-cancel-ticketing-auto/blob/master/guide1.png?raw=true "Guide Image")

5. 좌석 색상코드 삽입

예시 ) ``` var selectColor = "#BEA886"; ```

6. 공연 예매 접속
7. (선택) 좌석이 아닌 구역이 있다면 원하는 구역까지 클릭
8. 보안문자[캡차] 입력
9. F12 -> Console -> 스크립트 붙여넣기
10. 정지 원할경우 Console창에 stop() 입력

## 시연 영상
https://github.com/user-attachments/assets/fbd86130-d48d-4a87-9df0-de42107d22d4

## 안내 사항
- 실행 후 창을 내려 다른 작업을 하셔도 됩니다.
- 상업적 이용시 문제에 대해 책임은 본인에게 있습니다.

## 다른 예매처
- [🚶‍♂️ 인터파크 취켓팅 자동화 스크립트](https://github.com/KnifeLemon/interpark-cancel-ticketing-auto)

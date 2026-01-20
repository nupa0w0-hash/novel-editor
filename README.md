# Novel Editor 📝

라이브 프리뷰와 HTML 내보내기 기능을 갖춘 독립형 소설 글쓰기 에디터

## ✨ 특징

- **라이브 프리뷰**: 작성 중인 내용을 실시간으로 확인
- **HTML 내보내기**: 클릭 한 번으로 HTML 파일로 변환 및 복사
- **다양한 테마**: 6가지 기본 프리셋 + 커스텀 프리셋 저장
- **자동 저장**: 로컬 스토리지를 활용한 초안 자동 저장
- **타이포그래피 커스터마이징**: 폰트, 크기, 줄 간격, 자간 등 세밀한 조정
- **대화 하이라이트**: 따옴표 내용 자동 강조 표시
- **히어로 이미지**: 배경, 상단, 하단 배치 지원 + 다양한 비율

## 🚀 빠른 시작

### 로컬 실행

```bash
# 저장소 복제
git clone https://github.com/nupa0w0-hash/novel-editor.git
cd novel-editor

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### Vercel에 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nupa0w0-hash/novel-editor)

1. 위 버튼 클릭 후 Vercel 계정으로 로그인
2. 프로젝트 이름 설정
3. Deploy 클릭
4. 배포 완료!

## 📚 사용 방법

### 1. 기본 정보 입력

**Inputs** 탭에서:
- 제목, 부제, 저자명 입력
- 태그를 쉼표로 구분하여 입력
- 본문 작성 (두 번 엔터 = 새 문단)

### 2. 히어로 이미지 추가 (선택)

- 이미지 URL 입력
- 레이아웃 선택: Background, Above, Below
- 비율 선택: 16:9, 9:16, 1:1 등
- 제목 위치 조정 (background 모드일 때)

### 3. 스타일 커스터마이징

**Styles** 탭에서:
- 기본 프리셋 선택 (Paper White, Dark Mode, 등)
- 폰트, 크기, 줄간격, 자간 조정
- 배경색, 텍스트 색상 변경
- 대화 하이라이트 색상 설정
- 현재 설정을 커스텀 프리셋으로 저장

### 4. HTML 내보내기

- **Copy HTML**: HTML 코드를 클립보드에 복사
- **Download**: HTML 파일로 다운로드

## 🎨 기본 테마

1. **Paper White** - 깨끗한 흰색 배경
2. **Warm Sepia** - 따뜻한 고서적인 분위기
3. **Dark Mode** - 눈이 편한 어두운 테마
4. **Rose** - 부드러운 로즈 톤
5. **Forest** - 자연스러운 초록 톤
6. **Noir** - 모노크롬 감성

## 🛠️ 기술 스택

- **React 18** - UI 프레임워크
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 환경
- **Tailwind CSS** - 유틸리티 퍼스트 CSS
- **LocalStorage** - 로컬 데이터 저장

## 📝 프로젝트 구조

```
novel-editor/
├── src/
│   ├── components/
│   │   ├── NovelEditor.tsx    # 메인 에디터 컬포넌트
│   │   └── NovelPreview.tsx   # 라이브 프리뷰 컬포넌트
│   ├── utils/
│   │   └── htmlExporter.ts    # HTML 생성 유틸리티
│   ├── types.ts              # TypeScript 타입 정의
│   ├── App.tsx               # 루트 컬포넌트
│   ├── main.tsx              # 엔트리 포인트
│   └── index.css             # 글로벌 스타일
├── package.json
├── vite.config.ts
├── vercel.json           # Vercel 배포 설정
└── README.md
```

## 🐛 버그 리포트 & 기능 요청

[Issues](https://github.com/nupa0w0-hash/novel-editor/issues) 탭에서 버그를 리포트하거나 새로운 기능을 제안해주세요!

## 📜 라이센스

MIT License

## 🚀 로드맵

- [ ] 마크다운 지원
- [ ] PDF 내보내기
- [ ] 이미지 업로드 기능
- [ ] 여러 페이지 관리
- [ ] 협업 기능

---

Made with ❤️ by [nupa0w0-hash](https://github.com/nupa0w0-hash)
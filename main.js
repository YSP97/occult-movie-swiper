import { movieTitle, movieText } from './data.js';

const progressBar = document.querySelector('.autoplay-progress svg');
let videoList = document.querySelectorAll('video');
const volumeBtn = document.querySelector('.volume-btn');
const volumeIcon = document.querySelector('.volume-btn i');
const slideBtn = document.querySelector('.slide-btn');
const slideIcon = document.querySelector('.slide-btn i');
const controlGroup = document.querySelector('.control-group');
const explainField = document.querySelector('.explain');
let pause = false;
const header = document.querySelector('h1');

// 스와이퍼 설정 객체
const obj = {
  loop: true,
  speed: 2000,
  autoplay: {
    delay: 30000,
    disableOnInteraction: false,
    enabled: true,
  },
  pagination: {
    el: '.main-swiper .swiper-pagination',
    clickable: false,
    type: 'custom',
  },
  navigation: {
    nextEl: '.main-swiper .swiper-button-next',
    prevEl: '.main-swiper .swiper-button-prev',
  },
  on: {
    autoplayTimeLeft(s, time, progress) {
      progressBar.style.setProperty('--progress', 1 - progress);
    },
    slideChange() {
      const previousIndex = this.previousIndex;
      const currentIndex = this.realIndex;

      // 제목과 텍스트 바꾸기
      header.textContent = movieTitle[currentIndex];
      explainField.innerHTML = movieText[currentIndex];
      videoList[currentIndex].muted = true;
      videoList[previousIndex].muted = true;

      // 이전으로 넘겼을 때 이전 페이지 영상 재생 멈추고 mute
      if (videoList[previousIndex]) {
        videoList[previousIndex].pause();
        videoList[currentIndex].muted = true;
        videoList[previousIndex].currentTime = 0;
      }

      // 현재 영상을 재생하고 delay를 영상 길이만큼 늘려주기
      if (videoList[currentIndex]) {
        videoList[currentIndex].play().catch((error) => console.log(error));
        updateVolumeIcon(videoList[currentIndex]);
        this.params.autoplay.delay =
          (videoList[currentIndex].duration || 77) * 1000;
      }
      videoList[currentIndex].muted = true;

      if (pause) {
        let video = videoList[this.realIndex];
        video.pause();
      }
    },
  },
};

// 메인 스와이퍼 생성
const mainSwiper = new Swiper('.main-swiper', obj);

// 볼륨 아이콘 변경
function updateVolumeIcon(video) {
  if (video.muted) {
    volumeIcon.classList.remove('fa-volume-high', 'volume-on');
    volumeIcon.classList.add('fa-volume-xmark', 'volume-off');
  } else {
    volumeIcon.classList.remove('fa-volume-xmark', 'volume-off');
    volumeIcon.classList.add('fa-volume-high', 'volume-on');
  }
}

// 볼륨버튼 클릭시 비디오 플레이어 뮤트, 언뮤트 제어 함수
function handleVideoPlayer() {
  const video = videoList[mainSwiper.realIndex];
  if (video.muted) {
    video.muted = false;
    updateVolumeIcon(video);
  } else {
    video.muted = true;
    updateVolumeIcon(video);
  }
}

// 재생버튼 누를 시 비디오 멈추고 슬라이드 넘기기 멈추는 함수
function handleSlide() {
  const video = videoList[mainSwiper.realIndex];
  if (!pause) {
    video.pause();
    mainSwiper.autoplay.stop();
    slideIcon.classList.add('fa-play');
    slideIcon.classList.remove('fa-pause');
    pause = true;
  } else {
    video.play().catch((error) => console.log(error));
    mainSwiper.autoplay.start();
    slideIcon.classList.add('fa-pause');
    slideIcon.classList.remove('fa-play');
    video.currentTime = 0;
    pause = false;
  }
}

volumeBtn.addEventListener('click', handleVideoPlayer);
slideBtn.addEventListener('click', handleSlide);

// 마우스 접근시 보여주는 함수
function handleShowing() {
  controlGroup.style.display = 'block';
}

// 마우스 멀어지면 사라지는 함수
function handleHiding() {
  controlGroup.style.display = 'none';
}

document.querySelector('section').addEventListener('mouseenter', handleShowing);
document.querySelector('section').addEventListener('mouseleave', handleHiding);

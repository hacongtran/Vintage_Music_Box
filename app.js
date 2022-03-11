const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'REM_PLAYER'

const playList = $('.playlist')
const cd = $('.cd')
const heading = $("header h2")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn =$('.btn-repeat')


const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        songs: [
            {
                name: "Howl's Moving Castle - Merry go round of Life",
                singer: 'Grissini Project',
                path: './Asset/Music/1.mp3',
                image: './Asset/Image/rem1.jpg'
            },
            {
                name: "Wiegenlied Op. 49: No. 4",
                singer: 'Brahms',
                path: './Asset/Music/2.mp3',
                image: './Asset/Image/rem2.jpg'
            },
            {
                name: "Gymnopédie No.1",
                singer: 'Satie',
                path: './Asset/Music/3.mp3',
                image: './Asset/Image/rem3.jpg'
            },
            {
                name: "Nocturne in e flat major",
                singer: 'Chopin',
                path: './Asset/Music/4.mp3',
                image: './Asset/Image/rem4.jpg'
            },
            {
                name: "River Flows in You",
                singer: 'Yiruma',
                path: './Asset/Music/5.mp3',
                image: './Asset/Image/rem5.jpg'
            },
            {
                name: "Rondo Alla Turca",
                singer: 'Mozart',
                path: './Asset/Music/6.mp3',
                image: './Asset/Image/rem6.jpg'
            },
            {
                name: "Fade Past - Saxophone",
                singer: 'Tạ Trung Đức',
                path: './Asset/Music/7.mp3',
                image: './Asset/Image/rem7.jpg'
            }  
        ],
        render: function(){
            const htmls = this.songs.map((song, index) => {
                return `
                     <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                `
            })
            playList.innerHTML = htmls.join('');
        },
        defineProperties: function(){
            Object.defineProperty(this, 'currentSong',{
                    get: function(){
                        return this.songs[this.currentIndex]
                    }
                 
            })
        },
        handleEvents: function(){ 
            const cdWidth = cd.offsetWidth
            
            //  Phóng to thu nhỏ đĩa CD khi scroll
            document.onscroll = function (){
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newcdWidth = cdWidth - scrollTop
                
                cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
                cd.style.opacity = newcdWidth / cdWidth
            }

            // Xử lý khi click Play - Pause
            playBtn.onclick = function() {
                if (app.isPlaying) {
                    audio.pause()
                }    
                else {
                    audio.play()
                }
               
            }
            //  Khi bài hát chạy
                audio.onplay = function () {
                    app.isPlaying = true
                    player.classList.add('playing')
                    cdThumbAnimate.play()
                }
            //  Khi bài hát dừng
                audio.onpause = function () {
                    app.isPlaying = false
                    player.classList.remove('playing')
                    cdThumbAnimate.pause()

                }
            //  Khi tiến độ bài hát thay đổi
                audio.ontimeupdate = function () {
                    if (audio.duration) {
                        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                        progress.value = progressPercent
                    }
                }
            //  Xử lý khi tua bài hát
                progress.onchange = function (e) {
                    const seekTime = audio.duration /100 * e.target.value
                    audio.currentTime = seekTime
                  }
            //  Xử lý CD quay và dừng
                const cdThumbAnimate = cdThumb.animate([
                    { transform:'rotate(360deg)'}
                ],{
                    duration: 28000,
                    iterations: Infinity
                })
                cdThumbAnimate.pause()  
            //  Khi next bài hát
                nextBtn.onclick = function(){
                    if (app.isRandom){
                        app.randomMode()
                    }
                    else{
                        app.nextSong()
                    }
                    audio.play()
                    app.render()
                    app.scrollToActiveSong()
                }
            //  Khi tua lui bài hát
                prevBtn.onclick = function(){
                    if (app.isRandom){
                        app.randomMode()
                    }
                    else{
                        app.prevSong()
                    }
                    audio.play()
                    app.render()
                    app.scrollToActiveSong()
                    
                }
            //  Random click 
                randomBtn.onclick = function(){
                   app.isRandom = !app.isRandom
                   randomBtn.classList.toggle('active', app.isRandom)
                }
            //  Next khi kết thúc bài hất
                audio.onended = function () {
                    if(app.isRepeat){
                        audio.play()
                    }
                    else{
                        nextBtn.click()
                    }
                }
            // Xử lý lặp lại một bài hát
                repeatBtn.onclick = function(){
                    app.isRepeat = !app.isRepeat
                    repeatBtn.classList.toggle('active', app.isRepeat)
                }
            //  Hành vi lắng nghe khi click vào playlist
            playList.onclick = function (e) {
                const songNode = e.target.closest(".song:not(.active)");
          
                if (songNode || e.target.closest(".option")) {
                  
                  if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                  }
          
                  if (e.target.closest(".option")) {
                  }
                }
              }
            
         
        },
        loadCurrentSong: function(){
                heading.textContent = this.currentSong.name
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
                audio.src = this.currentSong.path     

        },
        nextSong: function() {
                this.currentIndex++
                if (this.currentIndex >= this.songs.length){
                    this.currentIndex = 0;
                }
                this.loadCurrentSong()
        },
        prevSong: function() {
            this.currentIndex--
            if (this.currentIndex < 0){
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong()
        },
        randomMode: function(){
            let newIndex
            do {
               newIndex = Math.floor(Math.random() * this.songs.length)
            }
            while (newIndex === this.currentIndex)

            this.currentIndex = newIndex
            this.loadCurrentSong()
        },
        scrollToActiveSong: function () {
            setTimeout(() => {
              $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
              });
            }, 250);
          },
        start: function(){
        //  Định nghĩa các thuộc tính cho Object
            this.defineProperties()
        //  Lắng nghe và xử lý các sự kiện trong Dom Event
            this.handleEvents()
        //  Tải thông tin bài hát đầu tiên vào giao diện khi chạy ứng dụng
            this.loadCurrentSong()
        // Render PlayList
            this.render()

            randomBtn.classList.toggle("active",this.isRandom);
            repeatBtn.classList.toggle("active",this.isRepeat);
        }
         
}
    app.start()
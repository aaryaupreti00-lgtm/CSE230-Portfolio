class ImageSlider{
    constructor(selector){
        this.slider = document.querySelector(selector);
        this.track = this.slider.querySelector(".slider-track");
        this.slides = Array.from(this.track.children);
        this.prevButton = this.slider.querySelector(".prev");
        this.nextButton = this.slider.querySelector(".next");
        this.dotsContainer = this.slider.querySelector(".slider-dots");
        this.dots = [];
        this.currentIndex = 0;   
        this.position = 1;       
        this.isMoving = false;
        this.timer = null;
        this.moveTimer = null;
        this.init();
    }
    
    init(){
        this.createClones();
        this.bindEvents();
        this.createDots();
        this.jumpToPosition(1);
        this.updateDots();
        this.startAutoSlide();
    }
    
    createClones(){
        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.slides.length - 1].cloneNode(true);
        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.slides[0]);
    }
    
    updateSlidePosition(){
        const offset = -this.position * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }
    
    jumpToPosition(position){
        this.track.classList.add("no-transition");
        this.position = position;
        this.updateSlidePosition();
        void this.track.offsetWidth;
        this.track.classList.remove("no-transition");
    }
    
    moveToPosition(position){
        if(this.isMoving || position === this.position){
            return;
        }
        this.isMoving = true;
        this.position = position;
        this.currentIndex = (position - 1 + this.slides.length) % this.slides.length;
        this.updateSlidePosition();
        clearTimeout(this.moveTimer);
        this.moveTimer = setTimeout(() => this.finishMove(), 700);
    }
    
    nextslide(){
        this.moveToPosition(this.position + 1);
    }
    
    prevslide(){
        this.moveToPosition(this.position - 1);
    }
    
    finishMove(){
        if(!this.isMoving){
            return;
        }
        clearTimeout(this.moveTimer);
        if(this.position === 0){
            this.jumpToPosition(this.slides.length);
        }
        else if(this.position === this.slides.length + 1){
            this.jumpToPosition(1);
        }
        this.isMoving = false;
    }
    
    handleTransitionEnd(event){
        if(event.target !== this.track || event.propertyName !== "transform"){
            return;
        }
        this.finishMove();
    }
    
    bindEvents(){
        this.nextButton.addEventListener("click", () => this.nextslide());
        this.prevButton.addEventListener("click", () => this.prevslide());
        this.track.addEventListener("transitionend", (event) => this.handleTransitionEnd(event));
        this.slider.addEventListener("mouseenter", () => this.stopAutoSlide());
        this.slider.addEventListener("mouseleave", () => this.startAutoSlide());
    }
    
    createDots(){
        this.dotsContainer.innerHTML = "";
        this.slides.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            dot.addEventListener("click", () => this.moveToPosition(index + 1));
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }
    
    updateDots(){
        this.dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === this.currentIndex);
        });
    }
    
    startAutoSlide(){
        this.stopAutoSlide();
        this.timer = setInterval(() => this.nextslide(), 5000);
    }
    
    stopAutoSlide(){
        clearInterval(this.timer);
    }
}

document.addEventListener("DOMContentLoaded", () => new ImageSlider(".slider"));
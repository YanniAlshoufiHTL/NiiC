const items: NodeListOf<HTMLInputElement> = document.querySelectorAll("input[name='niic-landing-main-navigation-items']");
let landingPageCurrentSlide = "main";

interface Slide {
    name: string,
    orientation: "right" | "left",
    content: string,
    media: string | undefined,
    approximateRatio: string,
}

const slides: Slide[] = [
    {
        name: "main",
        orientation: "right",
        content: `
            <h1>No 'i' in Cal!</h1>

            <p>A calendar with features</p>
            <p>unimaginable for the industry giants!</p>
            <br>
            <p>It's free and great, check it out!</p>
            <br>
            <a href="../index.html" class="niic-call-to-action-btn">START USING</a>
            `,
        media: undefined,
        approximateRatio: "6:5",
    },
    {
        name: "modularity",
        orientation: "left",
        content: `
            <h1>Modular in nature!</h1>
            <p>By not following the iCal format, we allow our calendar to achieve its full potential.</p>
            <br>
            <p>Check out what you can do with modules!</p>
            <br>
            <a href="docs.html" class="niic-call-to-action-btn">CHECK OUT MODULES</a>
            `,
        media: "../img/niic-landing-main-media-abstract.png",
        approximateRatio: "1:1"
    },
    {
        name: "plugins",
        orientation: "right",
        content: `
            <h1>Make your own plugins!</h1>
            <br>
            <p>We made it easy for you to make the calendar what you want it to be.</p>
            <p>Make your own plugins now!</p>
            <br>
            <a href="docs.html" class="niic-call-to-action-btn">LEARN MORE</a>
            `,
        media: "../img/niic-landing-main-media-code.png",
        approximateRatio: "6:5",
    },
];

for (
    /** @type {HTMLInputElement} */
    const item of items) {

    item.addEventListener("change", () => {
        landingPageCurrentSlide = item.value;
        updateLandingSlide();
    });
}

function wrapAsContent(content: string) {
    return `<div class="niic-landing-main-text-content">${content}</div>`
}

function updateLandingSlide() {
    const idx = slides.findIndex(x => x.name === landingPageCurrentSlide);

    if (idx === -1) {
        console.error("Slide not found!")
        return;
    }

    if (/^\d:\d$/.test(slides[idx].approximateRatio) === false) {
        console.error("Ratio not correct!")
        return;
    }

    const slide = slides[idx];
    const leftContainer = document.querySelector(".niic-landing-main-left") as HTMLDivElement;
    const rightContainer = document.querySelector(".niic-landing-main-right") as HTMLDivElement;

    const TEXT_CONTAINER_CLASS = 'niic-landing-main-text';
    const MEDIA_CONTAINER_CLASS = 'niic-landing-main-media';

    leftContainer.classList.remove(TEXT_CONTAINER_CLASS);
    leftContainer.classList.remove(MEDIA_CONTAINER_CLASS);
    leftContainer.innerHTML = "";
    leftContainer.style.backgroundImage = "";
    leftContainer.style.flex = slide.approximateRatio[0];

    rightContainer.classList.remove(TEXT_CONTAINER_CLASS);
    rightContainer.classList.remove(MEDIA_CONTAINER_CLASS);
    rightContainer.innerHTML = "";
    rightContainer.style.backgroundImage = "";
    rightContainer.style.flex = slide.approximateRatio[2];

    const textContainer = slide.orientation === "left"
        ? leftContainer
        : rightContainer;

    const mediaContainer = slide.orientation === "left"
        ? rightContainer
        : leftContainer;

    textContainer.classList.add(TEXT_CONTAINER_CLASS);
    mediaContainer.classList.add(MEDIA_CONTAINER_CLASS);
    textContainer.innerHTML = wrapAsContent(slide.content);

    if (slide.media === undefined) {
        return;
    }

    mediaContainer.style.backgroundImage = `url('${slide.media}')`;
}

updateLandingSlide();


// let blockModules: NiicBlockModule[];
//
// function setBlockModules() {
//     blockModules = JSON.parse(localStorage.getItem("blockModules") ?? "[]")
//         .map((x: NiicBlockModule) => {
//             const tmp: NiicBlockModule = {
//                 id: +x.id,
//                 title: x.title,
//                 description: x.description,
//                 type: x.type,
//                 html: x.html,
//                 css: x.css,
//                 js: x.js,
//             };
//             return tmp;
//         });
// }
//
// getModulesAndSetInLocalStorage_http()
//     .then(_ => {
//         setBlockModules();
//     });

const blockModules: NiicBlockModule[] = [
    {
        id: 1,
        title: 'Module 1',
        description: null,
        html: "<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, dolor.</div>",
        css: "div {background-color: blue; font-size: 3rem; font-family: Arial, sans-serif; color: orange;}",
        js: null,
        type: 'blm',
    },
    {
        id: 2,
        title: "Today's Quote",
        description: null,
        html: "<div></div>",
        css: `
            div {
                width: 100vw;
                height: 100vh;
                background-color: #145369;
                color: white;

                display: flex;
                justify-content: center;
                align-items: center;

                text-align: center;

                padding: 20px;
                box-sizing: border-box;

                font-family: Arial, sans-serif;
                font-size: 2rem;
            }
        `,
        js: `
        async function setQuote() {
            console.log("hi");
            const el = document.querySelector('div');
            const res = await fetch('https://type.fit/api/quotes');
            const quotes = await res.json();
            const randomIdx = Math.floor(Math.random() * quotes.length);
            el.innerText = quotes[randomIdx].text
        }
        setQuote();`,
        type: 'blm',
    },
    {
        id: 3,
        title: 'Module 3',
        description: null,
        html: "<div id='hi'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque aut, autem consectetur est impedit itaque minima nesciunt obcaecati omnis perspiciatis, quisquam veniam voluptatibus. Atque exercitationem nihil nostrum sapiente unde. Amet architecto aut corporis dolorem dolores, ex fugiat, fugit ipsa laborum magni molestiae molestias nihil officia pariatur quae quasi quia rem repellat, repellendus repudiandae sunt tempore voluptatibus. Deserunt fugiat odit pariatur praesentium, quas quis temporibus? Enim ipsum iusto molestias. Aliquam animi architecto aspernatur at consectetur deleniti dolor dolore doloribus earum eligendi est et exercitationem explicabo harum id illum incidunt ipsum iure iusto labore maiores maxime minus modi, nam necessitatibus officia officiis, pariatur porro quasi reprehenderit repudiandae sapiente suscipit unde, ut veniam vitae voluptate. Cupiditate facere officia praesentium quaerat quam? Accusamus debitis ex facilis harum in laboriosam laborum, nobis placeat? Aperiam consequuntur delectus dignissimos fugiat magni minima, neque quibusdam sit! Accusantium alias consequatur culpa cupiditate dicta, ducimus earum eligendi error esse est exercitationem expedita illum ipsa, iste iusto laudantium, minima minus mollitia necessitatibus neque nisi non numquam obcaecati placeat quae quam ratione recusandae rem repellendus reprehenderit repudiandae rerum sint suscipit tempore unde veniam voluptate! Ad architecto deleniti distinctio enim eveniet impedit maxime perferendis quas quibusdam. Adipisci commodi consequatur culpa debitis dolore doloribus eligendi impedit, nihil nostrum nulla officia praesentium quaerat recusandae repellat tempore. Deserunt eum magni suscipit tempora vel? Adipisci amet beatae cupiditate harum, numquam quam reiciendis sed voluptates. Alias at eius impedit minus, possimus quam quis rerum vero? Aut cupiditate distinctio dolorem earum exercitationem, fuga impedit ipsam magnam nostrum officiis, quidem saepe sequi soluta! Aperiam assumenda blanditiis distinctio ducimus eveniet illo minus praesentium quaerat. Accusamus, distinctio eum expedita nam neque obcaecati pariatur quod vero? Assumenda consectetur cumque incidunt quis, quos recusandae. Ad deserunt dignissimos dolore doloribus dolorum eius error expedita in minima mollitia rem temporibus veniam voluptas, voluptate voluptatibus. Amet architecto aspernatur blanditiis culpa cum cupiditate deleniti dolor dolore dolores doloribus earum eius error esse excepturi, explicabo facilis, fuga harum illum impedit ipsam ipsum magni maxime mollitia nobis nostrum nulla obcaecati quo reiciendis repudiandae sequi sint sunt suscipit, tempora tempore tenetur vero vitae! Accusamus amet animi autem culpa cum dignissimos distinctio ducimus eaque earum eligendi, exercitationem fuga illum incidunt ipsum labore laudantium magni minus officiis omnis perspiciatis quo quos repellendus reprehenderit sint voluptates? Alias aspernatur assumenda deleniti dolorem id optio ratione suscipit velit vitae. Animi deserunt est perferendis ullam. Aliquid architecto atque blanditiis cumque eos itaque iure labore libero nihil officia placeat praesentium provident quae quas qui quis reprehenderit sapiente sit suscipit, temporibus ut vel velit vero. Accusantium adipisci blanditiis, commodi ea, et ex fuga fugiat fugit impedit ipsam itaque laudantium maiores nam nemo nulla odio pariatur perferendis, quidem quod quos repudiandae veritatis voluptatem. Ab accusamus atque cum iusto laborum non officiis perferendis unde voluptatum? Alias animi, asperiores cum cupiditate delectus dignissimos eos facere fugiat fugit incidunt laudantium minus nulla numquam odio perferendis porro provident quae rerum similique vero. Amet autem beatae dolore dolorem dolorum, earum eius enim eum eveniet explicabo fuga illum in iste magnam magni maxime minus molestiae natus nisi, officia officiis omnis perspiciatis quidem quod reiciendis reprehenderit sunt, voluptates. Ab amet aperiam atque aut commodi consectetur cupiditate delectus deserunt ducimus ea ex id iure, laboriosam magni maxime minima nemo quaerat ratione reiciendis rem rerum tenetur velit? A animi asperiores aut commodi dicta dolor dolores ducimus ex explicabo harum inventore modi molestiae odio officiis omnis praesentium quod recusandae reiciendis reprehenderit repudiandae saepe, tempora tempore vel veniam voluptas! Accusantium amet, autem consectetur culpa doloremque doloribus inventore iusto maiores nulla voluptatibus. Asperiores consequuntur ducimus eius eos exercitationem laboriosam nam vel voluptatum. Aliquam architecto aspernatur commodi delectus laboriosam maiores nobis repudiandae! Doloribus ea facere fuga hic quidem. Asperiores cupiditate nisi repudiandae. Accusamus alias amet animi aut autem, blanditiis consectetur corporis delectus dolor dolore doloremque dolorum expedita fuga harum ipsa iure iusto, labore laudantium libero molestiae odio optio placeat quae quam quia quibusdam ratione sed sit unde voluptate. Accusantium aliquid atque aut deleniti dolorem ea enim est ex iste itaque, molestias numquam obcaecati pariatur perspiciatis qui quidem, quis quos reiciendis repellendus tempore! A, ad adipisci aliquid, animi aspernatur autem dolore dolorum expedita explicabo fugiat itaque laboriosam necessitatibus obcaecati ullam voluptates! A blanditiis corporis dolore dolorem eum fugiat harum modi, quis quos repellat sapiente, ut vel. A consectetur corporis cum debitis dolore ducimus, ea eaque eligendi esse fuga impedit ipsam ipsum iste, iusto labore laboriosam laborum laudantium molestiae necessitatibus odit omnis perferendis perspiciatis provident quaerat qui quia quisquam quo quod repellendus, rerum temporibus vel veritatis vitae! Aut culpa dignissimos dolor dolore eos libero odit quam quibusdam unde voluptatum! At consequatur cupiditate, eius itaque magni quasi. Adipisci distinctio expedita libero modi similique temporibus. Ab aliquam animi aperiam assumenda autem blanditiis dolorum eligendi iste maxime minima odio pariatur quam quibusdam quisquam rerum, tenetur ullam? Accusamus, accusantium alias commodi deserunt dolores dolorum eaque libero magnam minus perspiciatis quam quisquam quos tempora totam vero. Accusamus delectus eaque, excepturi fugiat magnam maxime repellat vel velit. Accusantium adipisci alias aut consequatur debitis dicta dolores, ea facere facilis fugiat illo in inventore iure libero, molestias nam nemo omnis perferendis porro provident quaerat quasi qui quia repellat repellendus reprehenderit saepe sequi sit veniam vero? Adipisci aliquam architecto beatae consectetur, eaque et illo porro qui repellendus rerum tempora velit voluptatem. Ducimus enim explicabo fuga harum id illo impedit iusto maiores minima, sunt! Accusantium ad aliquam aut beatae blanditiis consectetur cupiditate dicta distinctio dolorum enim ex facilis id ipsam labore laboriosam maxime nihil numquam odio officia repellendus reprehenderit, saepe sit tempore voluptate voluptatem? Ad beatae consequatur culpa dignissimos dolore earum, eius eligendi esse, explicabo libero, molestiae nostrum praesentium quod saepe suscipit vitae voluptate voluptates. Eaque eius eligendi, eos ipsa laborum nemo quisquam. Ab amet aperiam architecto at consectetur consequatur culpa deleniti dolor dolore dolores ea, fugiat harum ipsam iste itaque magni maiores minus molestias mollitia nobis nostrum nulla odit, officia optio possimus praesentium quas quidem reiciendis suscipit tempora ullam unde voluptate voluptatibus? Adipisci aperiam dolorem est iusto minima neque nihil similique. Ab, mollitia qui? Aliquid delectus doloribus in obcaecati praesentium sunt, veniam! Eaque, necessitatibus.</div>",
        css: null,
        js: null,
        type: 'blm',
    },
    {
        id: 4,
        title: 'Module 4',
        description: null,
        html: "<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus, dolor.</div>",
        css: "div {background-color: blue; font-size: 3rem; font-family: Arial, sans-serif; color: orange;}",
        js: null,
        type: 'blm',
    },

];
interface Section {
    title: string,
    content: string,
}

const sections: Section[] = [
    {
        title: "Welcome to module documentation!",
        content: `
        <h2>Overview</h2>

        <p>
        As you know, <a href="#">NiiC</a> is modular in nature. This means that you can create your own modules—AKA plugins—for yourself and other people to use. You can then publish the plugins on the <a href="#">plugin store</a>.
        </p>

        <p>
        The plugins are <a href="#">HTML</a>, <a href="#">CSS</a>, and <a href="#">JavaScript</a> projects behind the scenes. These are uploaded to the calendar server. As a developer, you have to pass a token and the files (as strings) to the <a href="#">NiiC Rest API (NRA.)</a> The API then evaluates the plugin based on the <a href="#">token</a> & plugin type.
        </p>
        `,
    },
    {
        title: "What do you need to make your own plugins?",
        content: `
        <h2>Prerequisite</h2> 

        <p>
        As mentioned in the <a href="#">Overview</a>, the plugins require HTML, CSS, and JavaScript. Thus, to make your own plugin, you’ll need knowledge of these technologies.
        </p>

        <p>
        Additionally, you will have to use either our <a href="#">Rust Interface (RI)</a> (recommended) or the NiiC <a href="#">Rest API (NRA)</a> directly.
        <p>
        `
    },
    {
        title: "What are tokens and why do you need them?",
        content: `
        <h2>Token System</h2>
        
        <p>
        A token is a sequence of characters that tells the NRA what your plugin is supposed to do. It contains metadata about the plugin you are working on. This includes…
        </p>
        
        <ul>
            <li>the <a href="#">kind of plugin</a> (background module, block module, ETC,)</li>
            <li>the <a href="#">plugin ID</a>,</li>
            <li>the <a href="#">read/write access</a> to the plugin,</li>
            <li>the <a href="#">purpose</a> of the plugin (testing, public use, commercial use,)</li>
            <li>the <a href="#">maker</a> of the plugin (person who generated the token.)</li>
        </ul>
        
        <p>
        To generate a token, you go to your <a href="#">Profile Settings > Generate Token</a> and choose the corresponding plugin options.
        </p>
        
        <p>
        When developing your plugin, you will have to provide the token either directly to the <a href="#">NRA</a> or to the <a href="#">RI</a> which does that for you. The token is needed when you create the plugin and if you want to update its files.
        </p>
        
        <p>Here is an example use of a token through the <a href="#">RI</a>.</p>
        
        <pre>
            <code>
use niic::prelude::*;

const TOKEN: &'static str = "...";

fn main() {
    // evaluates token at compile time
    let mut conn = NiicConnection::from(TOKEN);

    // reads files and stores corresponding strings
    //
    // StaticFileEach variant looks for exactly one
    // JavaScript file, one CSS file, and one HTML file
    let content_loader = NiicLoader::StaticFileEach("dist");
    
    let settings = NiicSettings {
        version: NiicVersion(0, 0, 1),
        type: NiicModuleType::BlockModule {
            html: content_loader.html_str,
            css: content_loader.css_str,
            js: content_loader.js_str,
        },
        Default::default() // use default settings for rest
    };

    conn.use(settings);

    conn.establish(); // establishes connection
}
            </code>
        </pre>
        `,
    },
    {
        title: "How do plugins work?",
        content: `
        <h2>Plugin Data</h2>
        
        <p>The biggest decider for how a plugin is structured is the <a href="#">kind of the plugin</a>, of which there are four. When you create a plugin, you have to decide for one.</p>
        
        <p>Additionally, a plugin has an <a href="#">ID</a> that uniquely identifies it. Each plugin is designated a <a href="#">group of people who have read/write access to it</a>. A plugin also has a purpose which informs the <a href="#">NRA</a> about the plugin’s usage (e.g. testing or publishing), <a href="#">a list of authors</a>, a <a href="#">token maker</a>, an optional <a href="#">description</a>, a title for the <a href="#">plugin store</a>, a <a href="#">version</a>, a list of files (as strings) which contain the plugin’s source code, and a <a href="#">license</a>.</p>
        
        <h2>Security Measures</h2>
        
        <p>Users of NiiC can activate and deactivate plugins from the <a href="#">plugin store</a>. If your plugin happens to make the calendar unusable, users can utilize the so-called <a href="#">secure mode</a> which allows them to access the pure calendar where all plugins are deactivated. There, they can deactivate any plugin.</p>
        
        <h2>Plugin ID</h2>
        
        <p>The plugin ID is a serial number that uniquely identifies each plugin. The development <a href="#">token</a>, you generate contains the plugin ID.</p>
        
        <h2>Authors vs Plugin Maker</h2>
        
        <p>The authors include all main contributors. These differ from the maker of the plugin, which is the person who generated the token used for development.</p>
        
        <h2>Read and Write Access</h2>
        
        <p>By default, all <a href="#">authors</a> and the <a href="#">maker</a> of the token have read and write access to the plugin and nobody else can even view it. You can still provide or take away read or write access from any NiiC user explicitly when generating the <a href="#">token</a>.</p>
        
        <h2>Versioning</h2>
        
        <p>The plugin version should confine by the <a href="https://semver.org">SemVer</a> versioning conversion.</p>
        
        <h2>Licensing</h2>
        
        <p>For simplicity reasons, a license is a short string with the official legal license name. The default license is “MIT.”</p>
        
        <h2>Kinds of Modules</h2>
        
        <h3>Block Modules</h3>
        
        <p>This kind of plugin restricts the source code to only access a certain frame on the calendar, somewhat like a widget on Android and iOS. These blocks are easy to add for users and integrate nicely with the general interface—e.g. by showing up in the block modules area..</p>
        
        <p>For block modules, you need the following source code:</p>
        
        <ul>
        <li>an <a href="#">HTML</a> string (displayed in block,) </li>
        <li>an optional <a href="#">JavaScript</a> string,</li>
        <li>an optional <a href="#">CSS</a> string (restricted for block.)</li>
        </ul>
        
        <h3>Background Modules</h3>
        
        <p>If your plugin does something more fundamental, such as changing the theme of the calendar or constantly doing something in the background, you can use a background module. These plugins do not add a module block for the user to easily add wherever they want but rather sits in the background.</p>
        
        <p>For background modules, you need the following source code:</p>
        
        <ul>
        <li>an <a href="#">HTML</a> string (appended to calendar body,)</li>
        <li>an optional <a href="#">JavaScript</a> string,</li>
        <li>an optional <a href="#">CSS</a> string (apply everywhere.)</li>
        </ul>
        
        <h3>Data Modules</h3>
        
        <p>Some plugins don’t change the UI but rather extend the capabilities of the base calendar. These plugins use data modules that are capable of adding fields to <a href="#">Appointments, Events, & Tasks (AETs)</a>, <a href="#">Calendar Views</a>, <a href="#">Calendar Settings</a>, and <a href="#">Profile Settings</a>. These fields can be customized and styled as you wish with a sensible set of default styles and <a href="#">components</a> provided by us, such as <a href="#">multi-selects</a> and <a href="#">check boxes</a>.</p>
        
        <p>Data-module development is a bit different. You set the field information using the <a href="#">NRA</a> directly or using the <a href="#">RI</a> (recommended.)</p>
        
        <p>Here is an example for a multi-select rating system.</p>
        
        <pre>
            <code class="language-rust">
const IMG: &'static str = "assets/star.svg";
const STYLES: &'static str = "style.css";

let mut conn = NiicConnection::from(TOKEN);
let settings = NiicSettings {
    type: NiicModuleType::DataModule {
        configuration: NiicDMConfiguartion {
            fields: vec![
                NiicAetField {
                    name: "Rating",
                    db_key: "rating",
                    type: NiicAetFieldType::MultiSelect(
                        vec![
                            NiicAetFieldMSOption::Image(IMG),
                            NiicAetFieldMSOption::Image(IMG),
                            NiicAetFieldMSOption::Image(IMG),
                            NiicAetFieldMSOption::Image(IMG),
                            NiicAetFieldMSOption::Image(IMG),
                        ],
                    ),
                   style: NiicLoader::Styles(FF8A00),
                },
            ],
        },
    },
    Default::default()
};

conn.use(settings);
conn.establish();
            </code>
        </pre>
        
        <p>Because of this dynamic, no source code is required. Depending on the configuration, you might still want to use:</p>
        
        <ul>
        <li>an <a href="#">HTML</a> string,</li>
        <li>a <a href="#">JavaScript</a> string,</li>
        <li>a <a href="#">CSS</a> string.</li>
        </ul>
        
        <h3>Module Bundles</h3>
        
        <p>For cases where you want to include the functionality of multiple plugins or maybe just have many possible <a href="#">blocks</a> to pick from, you can use module bundles. As the name suggests, these allow you to combine bundles into one.</p>
        
        <p>You can bundle plugins that you have access to—which allows you to share database values between them—or even ones that you do not have access to.</p>
        
        <pre>
            <code class="language-rust">
const TOKEN1: &'static str = "...";
const TOKEN2: &'static str = "...";
const TOKEN3: &'static str = "...";
const TOKEN4: &'static str = "...";

let mut conn = NiicConnection::from(TOKEN);
let settings = NiicSettings {
    type: NiicModuleType::ModuleBundle {
        modules: vec![
            NiicPluginLoader::from_token(TOKEN1),
            NiicPluginLoader::from_token(TOKEN2),
            NiicPluginLoader::from_token(TOKEN3),
            NiicPluginLoader::from_token(TOKEN4),
        ],
        shared: NiicLoader::StaticFileEach("dist"),
        Default::default()
    },
    Default::default()
};

conn.use(settings);
conn.establish();
            </code>
        </pre>
        
        <p>For shared functionality between plugins, you might use:</p>
        
        <ul>
        <li>an <a href="#">HTML</a> string,</li>
        <li>a <a href="#">JavaScript</a> string,</li>
        <li>a <a href="#">CSS</a> string.</li>
        </ul>
        
        <p>The plugins can check for the existence of shared files using the <a href="#">NiiC JavaScript library (NJL)</a>.</p>
        `,
    },
    {
        title: "How to use the Rust Interface?",
        content: `
        <h2>Rust Interface (RI)</h2>
        
        <p>Using the <a href="#">NRA</a> can get very tedious, so we have provided a Rust Interface to deal with it for you. It also does all the necessary data checks for you and you do not need to rewrite your code to update, you can just use the code for creating the plugin.</p>
        
        <p>For further information about the RI, visit the <a href="#">designated GitHub page</a>.</p>
        
        <h2>Creating or Updating Plugin</h2>
        
        <pre>
            <code class="language-rust">
const TOKEN: &’static str = "...";

let mut conn = NiicConnection::from(TOKEN);
let settings = NiicSettings {
    type: NiicModuleType::...,
    version: NiicVersion(0, 1, 0),
    authors: vec!["yannialshoufi"],
    title: "My plugin".into(),
    description: None,
    license: None,
};

conn.use(settings);
let result: Result<NiicNraResponse, NiicConnectionError> =    
    conn.establish();
            </code>
        </pre>
        
        <h2>Deleting Plugin</h2>
        
        <pre>
            <code class="language-rust">
const TOKEN: &’static str = "...";

let mut conn = NiicConnection::from(TOKEN);
let result: Result<NiicNraResponse, NiicConnectionError> =    
    conn.delete_plugin();
            </code>
        </pre>
        
        <h2>Publish Plugin</h2>
        
        <pre>
            <code class="language-rust">
const TOKEN: &’static str = "...";

let mut conn = NiicConnection::from(TOKEN);
let result: Result<NiicNraResponse, NiicConnectionError> =    
    conn.publish_plugin();
            </code>
        </pre>
        
        <h2>Take Down Plugin</h2>
        
        <pre>
            <code class="language-rust">
const TOKEN: &’static str = "...";

let mut conn = NiicConnection::from(TOKEN);
let result: Result<NiicNraResponse, NiicConnectionError> =    
    conn.take_down_plugin();
            </code>
        </pre>
        
        <p>Applying settings before publishing utilizes the authors as the users to take plugin down for. All other settings are simply ignored.</p>
        `,
    },
    {
        title: "How to use the NiiC UI Libraries?",
        content: `
        <h2>NiiC UI Libraries (NUL)</h2>
        
        <p>We provide certain UI abstractions for when you are creating your plugin. These are:</p>
        
        <ul>
        <li>the NiiC JavaScript Library (NJL,)</li>
        <li>the <a href="#">NiiC CSS Library (NCL,)</a></li>
        <li>and the NiiC Web Component Library (NWL.)</li>
        </ul>
        
        <h2>NiiC JavaScript Library (NJL)</h2>
        
        <p>The NJL provides these functions for you to use.</p>
        
        <pre>
            <code class="language-javascript">
function niicShowModal(
    text: string,
    bg: string = "white",
    fg: string = "black"
): void
            </code>
        </pre>
        
        <p>Can be used to show a modal to the user.</p>
        
        <pre>
            <code class="language-javascript">
function niicPrompt(
    text: string,
    default: string,
    bg: string = "white",
    fg: string = "black"
): string 
           </code>
        </pre>
        
        <p>Does the same as showModal but it also requires the user to input a string value.</p>
           
        <pre>
            <code class="language-javascript">
function niicSharedResourceExists(
    resourceName?: string,
): boolean 
           </code>
        </pre>
        
        <p>Checks if shared resources exist. If resourceName is provided, the function looks for the resource specifically and returns false if not found, even if there are other shared resources.</p>
        
        <pre>
            <code class="language-javascript">
function niicGetTheme(): "light" | "dark" | "custom"
           </code>
        </pre>
        
        <p>For now, the only theme this will return is “custom”. In the future, “custom” would stand for a theme provided by a plugin.</p>
        
        <h2>NiiC CSS Library (NCL)</h2>
        
        <p>The NCL provides some useful CSS properties. Setting these will either change the UI of the entire calendar (for background plugins) or only apply in a block (for block modules.) The library also provides some CSS classes similar to bootstrap classes, which when combined with the right set of HTML tags can be used to make components according to the NiiC-feel. Although, it is recommended to use the NWL instead for achieving that.</p>
        
        <p>The CSS properties mentioned.</p>
        
        <pre>
            <code class="language-css">
--niic-color-primary
--niic-color-secondary
--niic-color-btn-bg
--niic-color-btn-fg
--niic-gradient-linear-home-bg
           </code>
        </pre>
        
        <h2>NiiC Web Component Library (NWL)</h2>
        
        <p>If your plugin uses NiiC-feel items, you can use our native web components. These are pre-styled but can be extended and they adapt to changes of the CSS properties of the NCL.</p>
        
        <p>These are the provided web components.</p>
        
        <pre>
            <code class="language-html">
&lt;niic-text-input/&gt;

&lt;!-- "type" can be "dropdown" or "click" --&gt;
&lt;niic-multi-select type="dropdown"&gt;
    &lt;niic-select-option&gt;Option 1&lt;/niic-select-option&gt;
    &lt;niic-select-option&gt;Option 2&lt;/niic-select-option&gt;
&lt;/niic-multi-select>

&lt;niic-checkbox&gt;Checkbox label&lt;/niic-checkbox&gt;

&lt;!-- only date --&gt;
&lt;niic-datetime-input date/&gt;
&lt;!-- only time --&gt;
&lt;niic-datetime-input time/&gt;
&lt;!-- both --&gt;
&lt;niic-datetime-input/&gt;
&lt;niic-datetime-input date time/&gt;
            </code>
        </pre>
        `,
    },
    {
        title: "You are ready, my friend! :)",
        content: `
        <h2>That’s it!</h2>
        <p>Believe it or not, that is all there is to making plugins for the NiiC calendar! Thanks for reading. Now go ahead and leave your mark on our ecosystem, we love to see it! </p>
        `,
    },
];

const docsContainer = document.querySelector(".niic-docs-main") as HTMLElement;
const sectionsEl = document.querySelector(".niic-docs-sections") as HTMLElement;

docsContainer.innerHTML = sections.map(x => `
    <section id="${x.title.replaceAll(' ', '-')}">
        <h1>${x.title}</h1>
        <div>
        ${x.content}
        </div>
    </section>
`).join("");

sectionsEl.innerHTML = sections.map(x => `
    <li class="${x.title.replaceAll(' ', '-')}">
        <h1><a href="#${x.title.replaceAll(' ', '-')}">${x.title}</a></h1>
    </li>
`).join("")

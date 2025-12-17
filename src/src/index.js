import "./style.css";
import $ from "jquery";
import React, { useDebugValue, useEffect, useState } from "react";
import ReactDOM from "react-dom";

var width;
var height;
var font_size = parseFloat($("body").css("font-size"));

$(window).resize(() => {
  if ($(".row").height() + 3 * font_size >= $(window).height()) {
    $("body").css("overflow", "scroll");
    // $(".disclaimer").css("position", "relative");
  } else {
    $("html, body").animate({ scrollTop: 0 }, 0);
    $("body").css("overflow", "hidden");
    // $(".disclaimer").css("position", "absolute");
  }

  font_size = parseFloat($("body").css("font-size"));

  width = ($(".text-container").width() * 1.6) / font_size;
  height = $(window).height() / font_size;
});

const links = {
  "ethanmlowenthal(a)gmail.com": "mailto:ethanmlowenthal@gmail.com",
  linkedin: "https://www.linkedin.com/in/ethan-lowenthal",
  github: "https://github.com/EthanLowenthal",
  shadertoy: "https://www.shadertoy.com/user/Jinkweiq",
};

class Line extends React.Component {
  constructor(props) {
    super(props);
    $(window).resize(() => {
      this.forceUpdate();
    });
  }
  componentDidUpdate() {
    queueRedraw();
  }
  render() {
    return <>{"\n\n" + "-".repeat(Math.floor(width)) + "\n"}</>;
  }
}

const Links = (props) => {
  const { links } = props;

  return (
    <>
      <Line />
      <b>{props.title}</b>
      {"\n"}
      <blockquote>
        {Object.keys(links).map((each) => (
          <a
            href={links[each]}
            key={each}
            className="links"
            contentEditable="false"
          >
            {each}
          </a>
        ))}
      </blockquote>
    </>
  );
};

const Item = (props) => (
  <>
    <Line />
    <b>{props.title}</b>
    {"\n"}
    <blockquote>{props.text}</blockquote>
  </>
);

// ## About Me


// ## Experience

// ### PsiQuantum — R&D Engineer
// At PsiQuantum, I am part of a multidisciplinary team focused on building scalable quantum computing systems. My responsibilities include designing and testing experimental setups, analyzing data, and contributing to the development of new quantum hardware and software. I work closely with physicists, engineers, and software developers to accelerate progress toward practical quantum computing, supporting the company’s mission to deliver transformative technology.

// ## Skills

// - Developing and optimizing silicon photonics scalable manufacturing processes for quantum computing
// - Experimental design and data analysis
// - Full-stack software development
// - Python, C++, and scientific computing tools
// - Collaborative problem-solving
// - Technical documentation and communication

// ## Interests

// I am passionate about emerging technologies, scientific discovery, and contributing to projects that have a meaningful impact on society. Outside of work, I enjoy learning about new advancements in computing and exploring innovative approaches to technical challenges.

// ## Skills



const now = new Date()
const birthday = new Date('June 1, 2002 12:00:00');
const age = (now - birthday) / (1000 * 60 * 60 * 24 * 365);

const Text = () => {
  const items = [
    {
      title: "About Me",
      text:
        `I am a software engineer at PsiQuantum, developing and optimizing scalable manufacturing processes for photonics-based quantum computing. I thrive in collaborative environments, where I apply scientific rigor and creative problem-solving to complex technical challenges.`,
    },
    {
      title: "Projects & Skills",
      text: (
        <>
          {
            `- Silicon photonics research and development
- Experimental design and data analysis
- Full-stack software development
- Python, C++, and scientific computing tools
- Collaborative problem-solving
- Technical documentation and communication
`
          }
          <a
            href="https://www.shadertoy.com/view/wstBz4"
            contentEditable="false"
          >
            playable game of chess
          </a>
          {"."}
        </>
      ),
    },
    {
      title: "About This Site",
      text: (
        <>
          {`The background of the website is a fluid simulation based on the one by `}
          <a
            href="https://github.com/PavelDoGreat/WebGL-Fluid-Simulation"
            contentEditable="false"
          >
            Pavel Dobryakov
          </a>
          {` that will interact with the html on the page. You can play around with your mouse or `}
          <a contentEditable="true" className="underlined">
            click here to edit the content of this page
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="column column-text" contentEditable="true">
      <div className="text-container">
        <pre>
          {items.map((item) => (
            <Item {...item} key={item.title} />
          ))}
          <Links title={"More"} links={links} />
        </pre>
      </div>
    </div>
  );
};

const Image = () => (
  <div className="column">
    <div className="image-container">
      <pre>
        <code>
          <span>
            {"                "}|{"           \n"}
            {"               "}/{""}|{""}\{"          \n"}
            {"              "}/ | \{"         \n"}
            {"             "}/{"  "}|{"  "}\{"        \n"}
            {"            "}/{"   "}|{"   "}\{"       \n"}
            {"           "}/{"    "}|{"    "}\{"      \n"}
            {"          "}/{"     "}|{"     "}\{"     \n"}
            {"         "}/{"      "}|{"      "}\{"    \n"}
            {"        "}/{"       "}|{"       "}\{"   \n"}
            {"       "}/________|{"        "}\{"  \n"}
            {"           "}_____|__{"    "}___\_{"\n"}
            {"    "}______/ = = = =\__/__/_/{"\n"}
            {"   "}/{"                      "}/{" \n"}
            {"  "}/\_____________________/{"  \n"} / /{"        "}/{"  "}/
            {"            \n"}
            {""}/_/{"        "}/__/{"             \n"}
          </span>
        </code>
      </pre>
    </div>
  </div>
);

const SimResolution = () => {
  const res = {
    ultra: 1024,
    high: 512,
    medium: 256,
    low: 128,
    off: 0,
  };
  const [selected, select] = useState(res.medium);
  const setResolution = (res) => {
    fluidConfig.SIM_RESOLUTION = res;
    initFluid();
    select(res);
  };
  useEffect(() => {
    fluidConfig.SIM_RESOLUTION = selected;
    try {
      initFluid();
    } catch {}
  });
  return (
    <div className="sim-res">
      <pre>
        Sim Quality:
        <br />
        {Object.entries(res).map((e) => (
          <div key={e[1]}>
            <a
              contentEditable="false"
              onClick={() => {
                setResolution(e[1]);
              }}
              key={e[1]}
              className={e[1] == selected ? "selected" : ""}
            >
              {e[0]}
            </a>
            <br />
          </div>
        ))}
      </pre>
    </div>
  );
};


const Page = () => (
  <>
    <div className="row" contentEditable="false">
      <Text />
      <Image />
    </div>
    <SimResolution />
  </>
);
const root = document.getElementById("root");
ReactDOM.render(<Page />, root);
root.oninput = () => {
  queueRedraw();
};

$(window).trigger("resize");
document.body.setAttribute('spellcheck', false);

let t;
t = setInterval(() => {
  try {
    startSim();
    clearInterval(t);
  } catch {}
}, 100);

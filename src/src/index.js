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
    $(".disclaimer").css("position", "relative");
  } else {
    $("html, body").animate({ scrollTop: 0 }, 0);
    $("body").css("overflow", "hidden");
    $(".disclaimer").css("position", "absolute");
  }

  font_size = parseFloat($("body").css("font-size"));

  width = ($(".text-container").width() * 1.6) / font_size;
  height = $(window).height() / font_size;
});

const links = {
  "ethanmlowenthal(a)gmail.com": "mailto:ethanmlowenthal@gmail.com",
  instagram: "https://www.instagram.com/ethan.lowenthal/",
  facebook: "https://www.facebook.com/ETHANMLOWENTHAL",
  linkedin: "https://www.linkedin.com/in/ethan-lowenthal",
  shadertoy: "https://www.shadertoy.com/user/Jinkweiq",
  resume: "resume.pdf",
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

const Text = () => {
  const items = [
    {
      title: "About Me",
      text:
        "I am Ethan Lowenthal, a 18 year old college student. I graduated Gunn High School in 2020. \
In my free time, I love to bike, sail, and write code. \
I am also interested in machining and welding. \
I am always looking for new opportunities to learn and work on cool projects.",
    },
    {
      title: "Projects & Skills",
      text: (
        <>
          {
            "I did machining and managed the shop for the Gunn Robotics Team.\
I am fluent in Python, Javascript, and GLSL. I desigend a etched my own PCBs for a hat that plays music.\
One of my most notable shaders (program the run on the GPU) is a "
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
const Disclaimer = () => (
  <div className="disclaimer">
    <pre>
      <a href="disclaimer" contentEditable="false">
        disclaimer
      </a>
    </pre>
  </div>
);

const Page = () => (
  <>
    <div className="row">
      <Text />
      <Image />
    </div>
    <SimResolution />
    <Disclaimer />
  </>
);
const root = document.getElementById("root");
ReactDOM.render(<Page />, root);
root.oninput = () => {
  queueRedraw();
};

$(window).trigger("resize");

let t;
t = setInterval(() => {
  try {
    startSim();
    clearInterval(t);
  } catch {}
}, 100);

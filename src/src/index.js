import './style.css';
import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';

var width;
var height;
var font_size = parseFloat($("body").css("font-size"));

$(window).resize(() => {
	if ($(".row").height() + 3 * font_size >= $(window).height()) {
		$("body").css("overflow", "scroll");
		$(".disclaimer").css("position", "relative")
	} else {
		$("html, body").animate({scrollTop: 0}, 0);
		$("body").css("overflow", "hidden");
		$(".disclaimer").css("position", "absolute")
	}

	font_size = parseFloat($("body").css("font-size"));

	width = $(".text-container").width() * 1.6 / font_size;
	height = $(window).height() / font_size;
});


const links = {
	'ethanmlowenthal(a)gmail.com': 'mailto:ethanmlowenthal@gmail.com',
	'instagram': 'https://www.instagram.com/ethan.lowenthal/',
	'facebook': 'https://www.facebook.com/ETHANMLOWENTHAL',
	'linkedin': 'https://www.linkedin.com/in/ethan-lowenthal',
	'resume': 'resume.pdf',
};

class Line extends React.Component {
	constructor(props) {
		super(props);
		$(window).resize(() => {
			this.forceUpdate();
		})
	}
	render() {
		return(
			<>
				{"\n\n" + "-".repeat(Math.floor(width)) + "\n"}
			</>
		);
	}
}

const Links = (props) {
	const { links } = props;

	return (
		<>
			<Line />
			<b>{props.title}</b>
			{"\n"}
			<blockquote>
				{Object.keys(links).map(each => <a href={links[each]} key={each}>{each}</a>)}
			</blockquote>
		</>
	);
}

const Item = (props) => (
	<>
		<Line />
		<b>{props.title}</b>
		{"\n"}
		<blockquote>
			{props.text}
		</blockquote>
	</>
);

// class Fill extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		$(window).resize(() => {
// 			this.forceUpdate();
// 		})
// 	}
// 	render() {
// 		return(
// 			<>
// 				{"\n".repeat(Math.ceil(height))}
// 			</>
// 		);
// 	}
// };

const Text = () => {
	const items = [{
			title: 'About Me', 
			text: 'I am Ethan Lowenthal, a 17 year old student at Gunn High School. In my free time, I love to bike, sail, and write code. I am also interested in machining and welding. I am always looking for new opportunities to learn and work on cool projects.'
		},{
			title: 'Projects & Skills', 
			text: 'I do machining and manage the shop for the Gunn Robotics Team. Most of my coding projects involve websites and images. I am fluent in Python (Flask, PIL, Numpy OpenCV) and Javascript (JQuery, React). I desigend a etched my own PCBs for a hat that plays music and diagnosed and fixed many broken electronics.'
		},{
			title: 'About This Site', 
			text: 'This site was created for fun in 2019 with Node, React, Babel, and WebPack from scratch by Ethan Lowenthal.'
	}];

	return (
		<div class="column column-text">
			<div class="text-container">
				<pre>
					{items.map(item => <Item {...item} />)}
					<Links title={'More'} links={links} />
				</pre>
			</div>
		</div>
)};

const Image = () => (
	<div class="column">
		<div class="image-container">
				<pre>
					<code>
						<span>
{"                "}|{"           \n"}
{"               "}/|\{"          \n"}
{"              "}/ | \{"         \n"}
{"             "}/  |  \{"        \n"}
{"            "}/   |   \{"       \n"}
{"           "}/    |    \{"      \n"}
{"          "}/     |     \{"     \n"}
{"         "}/      |      \{"    \n"}
{"        "}/       |       \{"   \n"}
{"       "}/________|        \{"  \n"}
{"           "}_____|__    ___\_{"\n"}
{"    "}______/ = = = =\__/__/_/{"\n"}
{"   "}/                      /{" \n"}
{"  "}/\_____________________/{"  \n"}
{" "}/ /        /  /{"            \n"}
{""}/_/        /__/{"             \n"}

						</span>
					</code>
				</pre>
		</div>
	</div>
);

const Disclaimer = () => (
	<div class="disclaimer">
		<pre><a href="disclaimer">disclaimer</a></pre>
	</div>
);

const Page = () => (
	<>
		<div class="row">
			<Text />
			<Image />
		</div>
		<Disclaimer />
	</>
);

ReactDOM.render(<Page />, document.getElementById('root'));

$(window).trigger('resize');

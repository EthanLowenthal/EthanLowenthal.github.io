import './style.css';
import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';

const Back = () => (
    <div className="back-btn">
        <pre><a href="..">{"<"}- Take me back!</a></pre>
    </div>
);


const Text = () => (
    <pre>
        Page not found!
    </pre>
);
const Home = () => (
    <pre>
        <a href={`https://${window.location.hostname}/`}>Go Home</a>
    </pre>
);

const Banner = () => (
    <pre>
        {" "}_  _    ___  _  _ {"  \n"}
        {""}| || |  / _ \| || |{"  \n"}
        {""}| || |_| | | | || |_{" \n"}
        {""}|__   _| | | |__   _|{"\n"}
        {"   "}| | | |_| |  | |{"  \n"}
        {"   "}|_|  \___/   |_|{"  \n"}
    </pre>
);

const Page = () => (
    <div className="container">
        <center>
            <Banner />
            <Text />
            <Home />
        </center>
    </div>
);

ReactDOM.render(<Page />, document.getElementById('root'));



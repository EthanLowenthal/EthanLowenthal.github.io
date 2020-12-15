import './style.css';
import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';

const Back = () => (
    <div className="back-btn">
        <pre><a href="..">{"<"}- Take me back!</a></pre>
    </div>
);


const Disclaimer = () => (
    <div className="container">
        <pre>
            Ascii art from <a href="http://www.asciiworld.com/-Boats-.html">www.asciiworld.com</a> and <a href="http://welcomemat.co/">welcomemat.co</a>.
            This product is meant for educational purposes only{"\n"}
            Not for commercial use{"\n"}
            Any resemblance to real persons, living or dead is purely coincidental{"\n"}
            Void where prohibited{"\n"}
            Some assembly may be required{"\n"}
            Batteries not included{"\n"}
            Contents may settle during shipment{"\n"}
            Use only as directed{"\n"}
            May be too intense for some viewers{"\n"}
            If condition persists, consult your physician{"\n"}
            No user serviceable parts inside{"\n"}
            Breaking seal constitutes acceptance of agreement{"\n"}
            Not responsible for direct, indirect, incidental or consequential damages resulting from any defect, error or failure to perform{"\n"}
            Slippery when wet{"\n"}
            For office use only{"\n"}
            Substantial penalty for early withdrawal{"\n"}
            Do not write below this line{"\n"}
            Your canceled check is your receipt{"\n"}
            Avoid contact with skin{"\n"}
            Employees and their families are not eligible{"\n"}
            Beware of dog{"\n"}
            Driver does not carry cash{"\n"}
            Limited time offer, call now to insure prompt delivery{"\n"}
            Use only in well ventilated area{"\n"}
            Keep away from fire or flame{"\n"}
            Some equipment shown is optional{"\n"}
            Price does not include taxes, dealer prep, or delivery{"\n"}
            Penalty for private use{"\n"}
            Call toll free before digging{"\n"}
            Some of the trademarks mentioned in this product appear for identification purposes only{"\n"}
            $100 bills not accepted{"\n"}
            All models over 18 years of age{"\n"}
            Do not use while operating a motor vehicle or heavy equipment{"\n"}
            Postage will be paid by addressee{"\n"}
            Apply only to affected area{"\n"}
            One size fits all{"\n"}
            Many suitcases look alike{"\n"}
            Edited for television{"\n"}
            No solicitors{"\n"}
            Reproduction strictly prohibited{"\n"}
            Restaurant package, not for resale{"\n"}
            Objects in mirror are closer than they appear{"\n"}
            Decision of judges is final{"\n"}
            This supersedes all previous notices{"\n"}
            No other warranty expressed or implied{"\n"}
            Syntax error: unexpected syntax{"\n"}
            For external use only{"\n"}
            Caution: Do not spray in eyes{"\n"}
            Do not use near fire, flame, or sparks{"\n"}
            Not intended for highway use{"\n"}
            Caution! Contents hot!{"\n"}
            Warning: May contain small parts{"\n"}
            Not suitable for children aged 36 months or less{"\n"}
            For use by trained personnel only{"\n"}
            Keep out of reach of children and teenagers{"\n"}
            Warning: knives are sharp!{"\n"}
            Theft of this container is a crime{"\n"}
            Fragile. Do not drop{"\n"}
            For indoor or outdoor use only{"\n"}
            This door is alarmed from 7:00pm - 7:00am{"\n"}
            Not for human consumption{"\n"}
            Do not attempt to stop the blade with your hand.{"\n"}
            Warning: May contain nuts{"\n"}
            Do not eat{"\n"}
            Do not eat if seal is missing{"\n"}
            Remove occupants from the stroller before folding it{"\n"}
            Do not put in mouth{"\n"}
            Not dishwasher safe{"\n"}
            For a limited time only{"\n"}
            No stopping or standing{"\n"}
            These rows reserved for parents with children{"\n"}
            Prescriptions cannot be filled by phone{"\n"}
            In case of flood, proceed uphill. In case of flash flood, proceed uphill quickly{"\n"}
            Remove the plastic wrapper{"\n"}
        </pre>
    </div>
);

const Page = () => (
    <>
        <Back />
        <Disclaimer />
    </>

);

ReactDOM.render(<Page />, document.getElementById('root'));



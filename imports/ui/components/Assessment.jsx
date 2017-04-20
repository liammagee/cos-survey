import React, { Component, PropTypes } from 'react';

import { Assessments } from '../../api/assessments.js';
import 'canvas2svg';


// Task component - represents a single todo item
export default class Assessment extends Component {


  componentDidMount() {
      this.updateCanvas();
  }

  updateCanvas() {
      const ctx = this.refs.canvas.getContext('2d');

      let circle, canvas, numCircles = 9;
      const config = {
          width: 1200,
          height: 800,
          numCircles: numCircles,
          drawDomains: true,
          drawSubdomains: true,
          axisLength: 1.2,
          axisWidth: 2,
          lineWidth: 1,
          radiusProportion: 0.4,
          font: "bold 14px sans-serif",
          rotation: 0,
          // domains: [
          //
          //     { name: 'Economics', subdomains: ["_____________________", "_____________________", "_____________________", "_____________________", "_____________________", "_____________________", "_____________________"] },
          //
          //     { name: 'Ecology', subdomains: ["_____________________", "_____________________", "_____________________", "_____________________", "_____________________", "_____________________", "_____________________"] },
          //
          //     { name: 'Culture', subdomains: ["_____________________", "_____________________", "_____________________", "_____________________", "_____________________", "_____________________", "_____________________"] },
          //
          //     { name: 'Politics', subdomains: ["_____________________", "_____________________", "_____________________", "_____________________", "_____________________", "_____________________", "_____________________"] }
          //     ]
          domains: [

              { name: 'Economics', subdomains: ["Short-termism", "Future of work", "Gentrification & affordability", "Insecure, low employment", "Education", "Funding health services", "Youth as assets"] },

              { name: 'Ecology', subdomains: ["Green spaces", "Ecological new developments", "Sustainable living", "Public transport", "Energy efficiency", "Environmental sustainability", "Digital spaces & capacities"] },

              { name: 'Culture', subdomains: ["Problematising Youth", "Options for Health & Wellbeing", "Intergenerational knowledge", "Disparity of opportunities", "Negative stigma in mental health", "High density living", "Gentrification"] },

              { name: 'Politics', subdomains: ["Will for alternative housing", "Youth influence", "Youth-friendly services", "Intergenerational tensions", "Agenda-setting bias", "Lightweight consultation", "Planning laws"        ] }
              ]
      };

      circle = new Assessment.Profile( ctx, config );
      circle.resetValues();
      circle.drawCompleteCircle();
      /* Event handling */
      circle.addHandler(this, ctx.canvas, circle.redrawSegment, circle.showSubdomain);

      for (let i = 0; i < this.props.assessment.ratings.length; i++) {
        let r = this.props.assessment.ratings[i];
        let d = Math.floor(i / 7);
        let s = i % 7;
        circle.updateCircleSegment(d, s, r);
      }
      this.circle = circle;
  }

  deleteThisAssessment() {
    Assessments.remove(this.props.assessment._id);
  }

  goToSummary() {
    this.props.router.push('/summary');
  }

  clear() {
    this.circle.resetValues( false );
  }

  exportSVG() {
    $('#svg-' + this.props.assessment._id).val(this.circle.ctxSVG.getSerializedSvg());
  }

  deleteButton() {
    if (this.props.isInteractive) {
      return (
        <button className="delete"  onClick={this.deleteThisAssessment.bind(this)}>
                  &times;
        </button>
      )
    }
    else {
      return('')
    }
  }

  submitAssessment() {
    if (this.props.isInteractive) {
      return (
        <button className="submit"  onClick={this.goToSummary.bind(this)}>
            Submit this Assessment
        </button>
      )
    }
    else {
      return('')
    }
  }

  clearAssessment() {
    if (this.props.isInteractive) {
      return (
        <button className="submit"  onClick={this.clear.bind(this)}>
            Clear
        </button>
      )
    }
    else {
      return('')
    }
  }

  exportAssessment() {
    return (
      <button className="submit"  onClick={this.exportSVG.bind(this)}>
          Export this Assessment
      </button>
    )
  }

  render() {
    return (
        <li>
          {this.deleteButton()}
          {this.props.assessment.text}
          <div>
          <canvas ref="canvas" id={this.props.assessment._id} width="1200" height="800"></canvas>
          </div>
          <div style={{float: 'right', font: 'bold 14px sans-serif'}} id={"tooltip-" + this.props.assessment._id}>
          </div>
          <div>
            {this.submitAssessment()}
            |
            {this.clearAssessment()}
            |
            {this.exportAssessment()}
          </div>

          <div>
            <textarea id={"svg-" + this.props.assessment._id} rows="10" cols="60">

            </textarea>
          </div>
        </li>
    );
  }
}



Assessment.domainColour = '#55b496';


Assessment.GenericCircle = function( ctx, config ) {

    let assessment = null;
    let circle = this;

    // Create a new mock canvas context. Pass in your desired width and height for your svg document.
    this.ctxSVG = new C2S(1200, 800);

    // Configurable variables
    let height = config.height || 100;
    let width = config.width || 100;
    let useSameArea = config.useSameArea === false ? false : true;
    let drawDomains = config.drawDomains === false ? false : true;
    let drawSubdomains = config.drawSubdomains === false ? false : true;
    let radiusProportion = typeof(config.radiusProportion) !== 'undefined' ? config.radiusProportion : 0.9;
    let numCircles = config.numCircles || 9;
    this.numDomains = config.numDomains || 4;
    this.numSubdomains = config.numSubdomains || 7;

    this.currentDomainId = -1;
    this.currentSubdomainId = -1;

    this.values = config.values || [];
    let rotation = typeof(config.rotation) !== 'undefined' ? config.rotation : 0;

    this.domains = config.domains || [
        { name: 'Economics', subdomains: ["Wealth & Distribution", "Technology & Infrastructure", "Labour & Welfare", "Consumption & Use", "Accounting & Regulation", "Exchange & Transfer", "Production & Resourcing"] },

        { name: 'Ecology', subdomains: ["Materials & Energy", "Water & Air", "Flora & Fauna", "Habitat & Settlements", "Built-Form & Transport", "Embodiment & Sustenance", "Emissions & Waste"] },

        { name: 'Culture', subdomains: ["Identity & Engagement", "Creativity & Recreation", "Memory & Projection", "Beliefs & Ideas", "Gender & Generations", "Enquiry & Learning", "Wellbeing & Health"] },

        { name: 'Politics', subdomains: ["Ethics & Accountability", "Dialogue & Reconciliation", "Security & Accord", "Representation & Negotiation", "Communication & Critique", "Law & Justice", "Organization & Governance"        ] }
        ];

    let ratings = config.ratings || [
        { label: "Critical", color: "#ED1C24" },
        { label: "Bad", color: "#F26522" },
        { label: "Highly Unsatisfactory", color: "#F7941E" },
        { label: "Satisfactory-", color: "#FFC20E" },
        { label: "Satisfactory", color: "#FFF200" },
        { label: "Satisfactory+", color: "#CBDB2A" },
        { label: "Highly Satisfactory", color: "#8DC63F" },
        { label: "Good", color: "#39B44A" },
        { label: "Vibrant", color: "#00A651" }
    ];
    /*
// Consider:
//     darker vibrant green
//     Change Satisfactory- to Unsatisfactory
//     Change Satisfactory to Neither Satisfactory nor Unsatisfactory
//     Change Satisfactory+ to Satisfactory
    let ratings = config.ratings || [
        { label: "Critical", color: "#ED1C24" },
        { label: "Bad", color: "#F26522" },
        { label: "Highly Unsatisfactory", color: "#F7941E" },
        { label: "Unsatisfactory", color: "#FFC20E" },
        { label: "Neither Unsatisfactory nor Satisfactory", color: "#FFF200" },
        { label: "Satisfactory", color: "#CBDB2A" },
        { label: "Highly Satisfactory", color: "#8DC63F" },
        { label: "Good", color: "#39B44A" },
        { label: "Vibrant", color: "#009631" }
    ];
    */

    // Computed variables
    let x = Math.floor(width / 2), y = Math.floor(y = height / 2);
    let radius = Math.floor(x * radiusProportion);
    let maxArea = Math.pow(radius, 2) * Math.PI;
    let axisLength = config.axisLength || 1;
    let axisWidth = config.axisWidth || 1;


    // Setup context
    ctx.lineWidth = config.lineWidth || 0.5;
    ctx.font = config.font || "18px sans-serif";
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI/180);
    ctx.translate(-x, -y);

    this.ctxSVG.lineWidth = config.lineWidth || 0.5;
    this.ctxSVG.font = config.font || "18px sans-serif";
    this.ctxSVG.translate(x, y);
    this.ctxSVG.rotate(rotation * Math.PI/180);
    this.ctxSVG.translate(-x, -y);



    this.resetValues = function( randomise ) {
        let domainValues = [];
        for ( let i = 0; i < this.numDomains; i++ ) {
            subdomainValues = [];
            for ( let j = 0; j < this.numSubdomains; j++ ) {
                let val = 0;
                if ( randomise )
                    val = Math.ceil(Math.random() * numCircles)
                subdomainValues.push( val );
            }
            domainValues.push(subdomainValues);
        }
        this.refreshValues(domainValues);
    };

    this.refreshValues = function(vals) {
        this.values = vals;

        if (! _.isUndefined(circle.assessment) ) {
          Assessments.update({ _id: circle.assessment.props.assessment._id }, {
            $set: { ratings: this.values },
          } );
        }

        this.drawCompleteCircle();
    }

    this.drawSegment = function(quadrant, sector, extent) {
        let colours = ratings.map(function(c) {return c.color;});
        let colour = colours[extent - 1];
        let quadFac = Math.PI;
        let dirFac = 1;

        let newRad = radius * extent / numCircles;
        if (useSameArea) {
            let newArea = maxArea * extent / numCircles;
            newRad = Math.pow(newArea / Math.PI, 1/2);
        }
        let startArcX = x + Math.sin(quadFac * sector  / this.numSubdomains) * dirFac * newRad;
        let startArcY = y + Math.cos(quadFac * sector  / this.numSubdomains) * dirFac * newRad;
        let endArcX = x + Math.sin(quadFac * (sector + 1) / this.numSubdomains) * dirFac * newRad;
        let endArcY = y + Math.cos(quadFac * (sector + 1)  / this.numSubdomains) * dirFac * newRad;
        let startAngle = Math.PI + Math.PI / (this.numSubdomains * 2) * (quadrant * this.numSubdomains + sector);
        let endAngle = startAngle + Math.PI / (this.numSubdomains * 2);


        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();


        if (typeof(colour) !== 'undefined') {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.arc(x, y, newRad, startAngle, endAngle, false);
          ctx.closePath();
          ctx.fillStyle = colour;
          ctx.fill();
        }

        this.ctxSVG.beginPath();
        this.ctxSVG.moveTo(x, y);
        this.ctxSVG.arc(x, y, radius, startAngle, endAngle, false);
        this.ctxSVG.closePath();
        this.ctxSVG.fillStyle = '#fff';
        this.ctxSVG.fill();

        if (typeof(colour) !== 'undefined') {
          this.ctxSVG.beginPath();
          this.ctxSVG.moveTo(x, y);
          this.ctxSVG.arc(x, y, newRad, startAngle, endAngle, false);
          this.ctxSVG.closePath();
          this.ctxSVG.fillStyle = colour;
          this.ctxSVG.fill();
        }

    }

    this.drawSegmentLines = function() {
        ctx.beginPath();
        let moduloFactor = this.domains.length;
        for (let i = 0; i < this.numDomains; i ++) {
            let quadFacLine = Math.PI;
            let dirFac = 1;
            switch(i) {
                case 0:
                    quadFacLine /= -2;
                    break;
                case 1:
                    quadFacLine /= -2;
                    dirFac = -1;
                    break;
                case 2:
                    quadFacLine /= 2;
                    dirFac = -1;
                    break;
                case 3:
                    quadFacLine /= 2;
                    break;
            }
            for (let j = 1; j < this.numSubdomains; j ++) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.sin(quadFacLine * j  / this.numSubdomains) * dirFac * radius, y + Math.cos(quadFacLine * j  / this.numSubdomains) * dirFac * radius);

                this.ctxSVG.moveTo(x, y);
                this.ctxSVG.lineTo(x + Math.sin(quadFacLine * j  / this.numSubdomains) * dirFac * radius, y + Math.cos(quadFacLine * j  / this.numSubdomains) * dirFac * radius);

            }
        }

        ctx.closePath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#444";
        ctx.stroke();

        this.ctxSVG.closePath();
        this.ctxSVG.lineWidth = 0.5;
        this.ctxSVG.strokeStyle = "#444";
        this.ctxSVG.stroke();

    }

    this.drawCircles = function() {
        for (let i = numCircles; i > 0; i -= 1) {
            let newRad = radius * i / numCircles;
            if (useSameArea) {
                let newArea = maxArea * i / numCircles;
                newRad = Math.pow(newArea / Math.PI, 1/2);
            }
            ctx.moveTo(x + newRad, y);
            ctx.arc(x, y, newRad, 0, Math.PI * 2, false);

            this.ctxSVG.moveTo(x + newRad, y);
            this.ctxSVG.arc(x, y, newRad, 0, Math.PI * 2, false);
        }

        ctx.closePath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#444";
        ctx.stroke();

        this.ctxSVG.closePath();
        this.ctxSVG.lineWidth = 0.5;
        this.ctxSVG.strokeStyle = "#444";
        this.ctxSVG.stroke();

    }

    this.drawAxes = function() {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - radius * axisLength);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + radius * axisLength);
        ctx.moveTo(x, y);
        ctx.lineTo(x - radius * axisLength, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x + radius * axisLength, y);
        ctx.closePath();
        let oldValue = ctx.lineWidth;
        ctx.lineWidth = axisWidth;
        ctx.strokeStyle = "#444";
        ctx.stroke();
        ctx.lineWidth = oldValue;

        this.ctxSVG.beginPath();
        this.ctxSVG.moveTo(x, y);
        this.ctxSVG.lineTo(x, y - radius * axisLength);
        this.ctxSVG.moveTo(x, y);
        this.ctxSVG.lineTo(x, y + radius * axisLength);
        this.ctxSVG.moveTo(x, y);
        this.ctxSVG.lineTo(x - radius * axisLength, y);
        this.ctxSVG.moveTo(x, y);
        this.ctxSVG.lineTo(x + radius * axisLength, y);
        this.ctxSVG.closePath();
        this.ctxSVG.lineWidth = axisWidth;
        this.ctxSVG.strokeStyle = "#444";
        this.ctxSVG.stroke();
        this.ctxSVG.lineWidth = oldValue;
    }


    this.drawDomains = function() {
        let angle = 45;
        ctx.fillStyle = Assessment.domainColour;
        for (let j = 0; j < this.domains.length; j++) {
            let domain = this.domains[j];
            let text = domain.name.toUpperCase();
            let len = text.length, s;
            let metrics = ctx.measureText(text);
            let w = metrics.width;
            let correction = (w / radius);
            let radiusCorrection = (correction * (Math.PI / 2)) / 2;

            ctx.save();
            ctx.translate(x, y);

            this.ctxSVG.save();
            this.ctxSVG.translate(x, y);

            let correctedAngle = (j * Math.PI / 2) - ((Math.PI / 4)) - radiusCorrection;

            ctx.rotate(correctedAngle);
            this.ctxSVG.rotate(correctedAngle);

            for (i = 0; i < len; i++) {
                // i / len
              ctx.save();
              ctx.rotate((i / len) * correction * (Math.PI / 2));
              ctx.translate(0, -1 * radius * 1.05);
              s = text[i];
              ctx.fillText(s, 0, 0);
              ctx.restore();

              this.ctxSVG.save();
              this.ctxSVG.rotate((i / len) * correction * (Math.PI / 2));
              this.ctxSVG.translate(0, -1 * radius * 1.05);
              s = text[i];
              this.ctxSVG.fillText(s, 0, 0);
              this.ctxSVG.restore();

            }

            ctx.restore();

            this.ctxSVG.restore();

        }
    }

    this.drawSubdomains = function() {
        let angle = 45;

        ctx.fillStyle = "black";
        this.ctxSVG.fillStyle = "black";

        let fontSize = 15;
        ctx.font = fontSize + "pt Arial";
        this.ctxSVG.font = fontSize + "pt Arial";

        for (let j = 0; j < this.domains.length; j++) {
            let domain = this.domains[j];
            let dt = domain.name.toUpperCase();

            ctx.save();
            ctx.translate(x, y);

            this.ctxSVG.save();
            this.ctxSVG.translate(x, y);

            // let correctedAngle = (j * Math.PI / 2) - ((Math.PI / 4)) - radiusCorrection;
            // ctx.rotate(correctedAngle);
            let subdomains = domain.subdomains;
            let sx = 0, sy = 0, vertDirection = -1, lineOffset = Math.round(fontSize * 1.6), vertOffset = 0;
            switch (j) {
                case 0:
                  sx = -x * 0.95;
                  sy = -y * 0.6;
                  vertDirection = -1;
                  vertOffset = 0;
                  ctx.textAlign = 'left';
                  this.ctxSVG.textAlign = 'left';
                    break;
                case 1:
                  sx = x * 0.95;
                  sy = -y * 0.6;
                  vertDirection = 1;
                  vertOffset = 0;
                  ctx.textAlign = 'right';
                  this.ctxSVG.textAlign = 'right';
                  break;
                case 2:
                  sx = x * 0.95;
                  sy = y * 0.6;
                  vertDirection = 1;
                  vertOffset = -lineOffset * 6;
                  ctx.textAlign = 'right';
                  this.ctxSVG.textAlign = 'right';
                  break;
                case 3:
                  sx = -x * 0.95;
                  sy = y * 0.6;
                  vertDirection = -1;
                  vertOffset = -lineOffset * 6;
                  ctx.textAlign = 'left';
                  this.ctxSVG.textAlign = 'left';
                  break;
            }

            ctx.font = (fontSize + 3) + "pt Arial";
            this.ctxSVG.font = (fontSize + 3) + "pt Arial";

            ctx.fillText(dt, sx, sy + vertOffset - (fontSize + 3) * 1.5);
            this.ctxSVG.fillText(dt, sx, sy + vertOffset - (fontSize + 3) * 1.5);

            ctx.font = fontSize + "pt Arial";
            this.ctxSVG.font = fontSize + "pt Arial";

            for (i = 0; i < subdomains.length; i++) {
              let index = vertDirection == -1 ? 6 - i : i;
              let text = subdomains[ index ];

              ctx.save();
              this.ctxSVG.save();

              if ( this.currentSubdomainId == index && this.currentDomainId == j ) {
                ctx.fillStyle = Assessment.domainColour;
                this.ctxSVG.fillStyle = Assessment.domainColour;
              }
              else {
                ctx.fillStyle = "black";
                this.ctxSVG.fillStyle = "black";
              }

              ctx.fillText(text, sx, sy + vertOffset + (i * lineOffset));
              ctx.restore();

              this.ctxSVG.fillText(text, sx, sy + vertOffset + (i * lineOffset));
              this.ctxSVG.restore();

            }
            ctx.restore();
            this.ctxSVG.restore();
        }
    }


    this.drawCompleteCircle = function() {
        // Draw segments lines
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        this.ctxSVG = new C2S(width, height);
        this.ctxSVG.clearRect(0, 0, width, height);
        this.ctxSVG.fillStyle = "white";
        this.ctxSVG.fillRect(0, 0, width, height);


        for (let i = 0; i < this.values.length; i++) {
            let domainValues = this.values[i];
            for (let j = 0; j < domainValues.length; j++) {
                this.drawSegment(i, j, domainValues[j]);
            }
        }

        // Draw 28 - 4 segment lines
        this.drawSegmentLines();
        this.drawAxes();
        this.drawCircles();

        if (drawDomains) {
          this.drawDomains();
        }

        if (drawSubdomains) {
          this.drawSubdomains();
        }
    }

    this.updateCircleSegment = function(domainId, subdomainId, extent) {
        if (typeof(this.values) === "undefined" ||
            typeof(this.values[0]) === "undefined")
          return;
        this.values[domainId][subdomainId] = extent;
        this.drawCompleteCircle();
        // this.drawSegment(domainId, subdomainId, extent);
        // this.drawSegmentLines();
        // this.drawCircles();
        // this.drawAxes();
    }

    this.findSegment = function(eventX, eventY, callback) {
        let coordX = eventX - x;
        let coordY = eventY - y;
        let hypotenuse = Math.pow(Math.pow(coordX, 2) + Math.pow(coordY, 2), 0.5);
        if (hypotenuse < radius) {
            // Which quadrant?
            let quadrant = 0;
            if (coordX < 0 && coordY < 0) {
                quadrant = 0;
            }
            else if (coordY < 0) {
                quadrant = 1;
            }
            else if (coordX < 0) {
                quadrant = 3;
            }
            else  {
                quadrant = 2;
            }
            let angleInRadians = Math.atan(coordX / coordY);
            let angle = (angleInRadians * 2 / Math.PI) * 90;
            switch (quadrant) {
                case 0:
                    angle = 180 + (90 - angle);
                    break;
                case 1:
                    angle = 180 + (90 - angle);
                    break;
                case 2:
                    angle = (90 - angle);
                    break;
                case 3:
                    angle = (90 - angle);
                    break;
            }
            let currentDomain = this.domains[quadrant];
            let subdomainId = Math.floor((angle / 360) * (4 * this.numSubdomains) ) % this.numSubdomains;
            let currentSubdomain = currentDomain.subdomains[subdomainId];
            oldValue = this.values[quadrant][subdomainId];
            let newValue = Math.floor((hypotenuse / radius) * numCircles) + 1;
            if (useSameArea) {
                let newArea = Math.pow(hypotenuse, 2) * Math.PI;
                newValue = Math.ceil(newArea / maxArea * numCircles);
            }
            callback(quadrant, currentDomain.name, subdomainId, currentSubdomain, oldValue, newValue);
        }
        else {
          this.currentDomainId = -1;
          this.currentSubdomainId = -1;
          this.drawCompleteCircle();
        }
    }


    this.getRatingText = function(index) {
        return ratings[index].label;
    }

    this.getRatingColor = function(index) {
        return ratings[index].color;
    }


    this.saveAssessment = function(domainId, subdomainId, newValue) {
      let ratingId = domainId * 7 + subdomainId;
      let ratings = circle.assessment.props.assessment.ratings;
      ratings[ratingId] = newValue;
      Assessments.update({ _id: circle.assessment.props.assessment._id }, {
        $set: { ratings: ratings },
      } );
    }

    this.redrawSegment = function(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
       circle.saveAssessment(domainId, subdomainId, newValue);
       circle.updateCircleSegment(domainId, subdomainId, newValue);
    };

    this.showSubdomain = function(domainId, domainName, subdomainId, subdomainName, oldValue, newValue) {
        jQuery("#tooltip-" + circle.assessment.props.assessment._id).html(domainName + ": " + subdomainName);
        //circle.updateCircleSegment(domainId, subdomainId, newValue);
        if (circle.drawSubdomains) {
          circle.currentDomainId = domainId;
          circle.currentSubdomainId = subdomainId;
          circle.drawCompleteCircle();
        }
    }

    this.randomise = function() {
        resetValues( true );
    }


    this.addHandler = function(assessment, canvas, callbackClick, callbackMove) {
        circle.assessment = assessment;
        if (callbackClick === null) {
          callbackClick = circle.redrawSegment;
        }
        if (callbackMove === null) {
          callbackMove = circle.showSubdomain;
        }
        if (circle.assessment.props.isInteractive) {
          $(canvas).on('click', (e) => {
            let point = circle.determinePoint(e);
            circle.findSegment(point.x, point.y, callbackClick);
          })
        }
        canvas.addEventListener('mousemove', function(e){
            let point = circle.determinePoint(e);
            circle.findSegment(point.x, point.y, callbackMove);
        });
    }

    this.determinePoint = function(e) {
        e = jQuery.event.fix(e || window.event);
        return {x: e.offsetX, y: e.offsetY};
    }

};



Assessment.Profile = function(ctx, config) {
    config = config || {};
    config.domains = config.domains || [

        { name: 'Economics', subdomains: ["Wealth & Distribution", "Technology & Infrastructure", "Labour & Welfare", "Consumption & Use", "Accounting & Regulation", "Exchange & Transfer", "Production & Resourcing"] },

        { name: 'Ecology', subdomains: ["Materials & Energy", "Water & Air", "Flora & Fauna", "Habitat & Settlements", "Built-Form & Transport", "Embodiment & Sustenance", "Emissions & Waste"] },

        { name: 'Culture', subdomains: ["Identity & Engagement", "Creativity & Recreation", "Memory & Projection", "Beliefs & Ideas", "Gender & Generations", "Enquiry & Learning", "Wellbeing & Health"] },

        { name: 'Politics', subdomains: ["Ethics & Accountability", "Dialogue & Reconciliation", "Security & Accord", "Representation & Negotiation", "Communication & Critique", "Law & Justice", "Organization & Governance"        ] }
        ];

    config.drawDomains = false;
    config.drawSubdomains = true;

    Assessment.GenericCircle.call( this, ctx, config );
};
Assessment.Profile.prototype = Object.create(Assessment.GenericCircle.prototype);


Assessment.circleFactory = Assessment.GenericCircle;

Assessment.propTypes = {
  router: PropTypes.object.isRequired,
  isInteractive: PropTypes.bool.isRequired,
  // This component gets the assessment to display through a React prop.
  // We can use propTypes to indicate it is required
  assessment: PropTypes.object.isRequired,
  circle: PropTypes.object,

};

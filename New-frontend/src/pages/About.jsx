import React from "react";
import { ShieldCheck, MapPin, Users, Sparkles } from "lucide-react";
import "./About.css";

const About = () => {
  return (
    <div className="about-wrapper">
      <section className="about-hero">
        <span className="hero-badge">🐾 About PetRescue</span>

        <h1>Reuniting Pets With Their Families</h1>

        <p className="about-tagline">
          Connecting lost pets with their families — faster and safer.
        </p>

        <p className="about-intro">
          PetRescue is a community-driven adoption and rescue platform that helps
          bring lost pets back home while supporting safe, verified adoptions
          through technology and compassion.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <h2>Who We Are</h2>
          <p>
            PetRescue is a digital platform built to support pet lovers, rescuers,
            and shelters using structured data, AI image matching, and admin
            verification.
          </p>
        </div>

        <div className="about-card">
          <h2>The Problem We Solve</h2>
          <p>
            Lost pets are scattered across social media and posters. We bring
            everything into one verified system.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            To reunite pets with families while enabling responsible rescue and
            adoption.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Vision</h2>
          <p>
            A connected ecosystem where every lost, found, and adoptable pet
            exists in one trusted place.
          </p>
        </div>
      </section>

      <section className="about-section">
        <h2>How PetRescue Works</h2>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-icon"><Users size={20} /></span>
            <h3>Signup</h3>
            <p>Create your secure account.</p>
          </div>

          <div className="step-card">
            <span className="step-icon"><MapPin size={20} /></span>
            <h3>Report</h3>
            <p>Submit lost or found pets with photos.</p>
          </div>

          <div className="step-card">
            <span className="step-icon"><Sparkles size={20} /></span>
            <h3>Match</h3>
            <p>AI connects possible matches.</p>
          </div>

          <div className="step-card">
            <span className="step-icon"><ShieldCheck size={20} /></span>
            <h3>Verify</h3>
            <p>Admins confirm and update results.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>

        <div className="features-columns">
          <div className="feature-column">
            <h3>Users</h3>
            <ul>
              <li>Lost pet reporting</li>
              <li>Found pet alerts</li>
              <li>Favorites</li>
              <li>Personal dashboard</li>
            </ul>
          </div>

          <div className="feature-column">
            <h3>Admins</h3>
            <ul>
              <li>Approve reports</li>
              <li>Manage listings</li>
              <li>AI matching</li>
              <li>Status analytics</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Why Choose Us</h2>

        <div className="chips-grid">
          <span className="chip">Secure</span>
          <span className="chip">Verified</span>
          <span className="chip">Fast</span>
          <span className="chip">AI Powered</span>
          <span className="chip">Modern UI</span>
          <span className="chip">Real Time</span>
        </div>
      </section>

      <section className="about-section impact">
        <h2>Impact</h2>
        <p>
          Every successful match reunites families or places pets in loving homes.
          We empower communities through technology.
        </p>
      </section>

      <section className="about-section team-contact">
        <div className="team-block">
          <h2>Team</h2>
          <p>
            Created as an internship project with mentors who believe in
            technology for social good.
          </p>
        </div>

        <div className="contact-block">
          <h2>Contact</h2>
          <ul>
            <li>Dashboard support</li>
            <li>FAQs</li>
            <li>
              <a href="mailto:support@petrescue.local">support@petrescue.local</a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;

import React from 'react';
import nam from "./../../assets/1.jpg";
import tien from "./../../assets/2.jpg";
import anh from "./../../assets/3.jpg";
import nguyen from "./../../assets/4.jpg";
import tri from "./../../assets/5.jpg";
const TeamSection = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r bg-gray-900 to-blue-300">
      <div className="bg-white w-full max-w-lg rounded-xl p-8 shadow-xl">
        <h2 className="text-center text-xl font-semibold">My Team</h2>
        <hr className="w-24 my-3 mx-auto" />
        <div className="flex justify-center">
          <div className="team-member mx-2 text-center">
            <img
              src={nam}
              alt="Nam"
              className="w-24 h-24 rounded-full mx-auto mb-2"
            />
            <h4 className="text-md font-medium">Nam</h4>
            <p className="text-sm text-gray-600">Front-End</p>
          </div>
          <div className="team-member mx-2 text-center">
            <img
              src={tien}
              alt="Tien"
              className="w-24 h-24 rounded-full mx-auto mb-2"
            />
            <h4 className="text-md font-medium">Tien</h4>
            <p className="text-sm text-gray-600">Back-End</p>
          </div>
          <div className="team-member mx-2 text-center">
            <img
              src={anh}
              alt="Vy Anh"
              className="w-24 h-24 rounded-full mx-auto mb-2"
            />
            <h4 className="text-md font-medium">Vy Anh</h4>
            <p className="text-sm text-gray-600">Front-End</p>
          </div>
          <div className="team-member mx-2 text-center">
            <img
              src={nguyen}
              alt="Nguyen"
              className="w-24 h-24 rounded-full mx-auto mb-2"
            />
            <h4 className="text-md font-medium">Nguyen</h4>
            <p className="text-sm text-gray-600">Front-End</p>
          </div>
          <div className="team-member mx-2 text-center">
            <img
              src={tri}
              alt="Tri"
              className="w-24 h-24 rounded-full mx-auto mb-2"
            />
            <h4 className="text-md font-medium">Tri</h4>
            <p className="text-sm text-gray-600">Back-End</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
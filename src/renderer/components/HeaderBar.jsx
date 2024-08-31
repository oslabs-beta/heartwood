// import React from "react";
// import '../styles.css';
// const HeaderBar = ({ toggleDarkMode, isDarkMode, onNotificationClick, user }) => {
//   return (
//     <header className="header-bar">
//       <div className="app-logo">
//         Heartwood
//         {/* <img src= image goes here alt="App Logo" /> */}
//       </div>
//       <div className="header-controls">
//         <button className="dark-mode-toggle" onClick={toggleDarkMode}>
//             {/* button image for dark/light goes here */}
//           {isDarkMode ? "dark" : "light"}
//         </button>
//         <button className="notification-bell" onClick={onNotificationClick}>
//             {/* button image for notification bell goes here */}
//           notifcation
//         </button>
//         <div className="user-icon">
//             {/* user profile image or basic user image goes here */}
//           user
//         </div>
//       </div>
//     </header>
//   );
// };

// export default HeaderBar;

import React from 'react';

const HeaderBar = ({ toggleDarkMode, isDarkMode, onNotificationClick }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-base-100 shadow-md">
      <div className="text-xl font-bold">Heartwood</div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="btn btn-primary">
          {isDarkMode ? 'Light' : 'Dark'}
        </button>
        <button onClick={onNotificationClick} className="btn btn-secondary">
          Notifications
        </button>
        <div className="avatar">
          <div className="w-10 rounded-full">
            user
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;

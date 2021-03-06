import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, useHistory } from 'react-router-dom';

import { usersActions } from '../../store';
import { MenuUser } from './_MenuUser';
import { menuLinks } from '../../constants';
import './_side_menu.scss';

const _SideMenu = ({ loggedUser, closeMenu, logout }) => {
  const history = useHistory();
  const menuRef = useRef();

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      closeMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  });

  if (!loggedUser) return null;

  return (
    <div className="side_menu" ref={menuRef}>
      <div className="side_menu__close_btn" onClick={closeMenu}></div>
      <MenuUser loggedUser={loggedUser} style={{ marginTop: '30px' }} />

      {menuLinks.map((link) => (
        <NavLink
          key={link.route}
          to={link.route}
          exact
          onClick={closeMenu}
          className="side_menu__mobile_link"
          activeClassName="side_menu__mobile_link__active"
        >
          {link.title}
        </NavLink>
      ))}

      <div className="side_menu__btn" onClick={() => logout(history)}>
        Logout
      </div>
    </div>
  );
};

const mapStateToProps = ({ users }) => ({
  loggedUser: users.logged_user,
});

const mapDispatchtoProps = (dispatch) => ({
  ...bindActionCreators(usersActions, dispatch),
});

export const SideMenu = connect(mapStateToProps, mapDispatchtoProps)(_SideMenu);

// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import clsx from 'clsx';
import { NavLink, BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Space, Divider } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import styles from './Header.module.css';
import { Button, Dropdown, MenuWithDesc, Typography } from '../../common';
import Logo from '../../../assets/logo.svg';

export interface AppLink {
  label: string;
  link: string;
}

export interface DetailedLink {
  label: string;
  description: string;
  link: string;
}

export interface DropdownLink {
  label: string;
  links: DetailedLink[];
}

export interface AppNavigation {
  label: string;
  link?: string;
  dropdown?: AppLink[];
}

export interface HeaderProps {
  dropdownLinks?: DropdownLink;
  appNavigation?: AppNavigation[];
  leftElement?: React.ReactElement;
  middleElement?: React.ReactElement;
  rightElement?: React.ReactElement;
}

const isExternalLink = (to: string) => to.startsWith('https') || to.startsWith('http');

const renderLink = (to: string, label: string) => {
  if (!isExternalLink(to)) {
    return (
      <Typography>
        <NavLink to={to} className={(isActive) => clsx(styles.navLink, isActive && styles.navLinkCurrent)}>
          {label}
        </NavLink>
      </Typography>
    );
  }

  return (
    <Button
      href={to}
      target="_blank"
      className={styles.navLink}
      rel="noreferrer"
      type="link"
      label={label}
      colorScheme="neutral"
    />
  );
};

export interface LeftHeaderProps {
  leftElement?: React.ReactNode;
  dropdownLinks?: DropdownLink;
  showDivider?: boolean;
}
const LeftHeader = ({ leftElement, dropdownLinks, showDivider }: LeftHeaderProps) => {
  const sortedDropdownLinks = !leftElement && dropdownLinks && (
    <div className={styles.leftElement}>
      <Dropdown
        label={dropdownLinks.label}
        LeftLabelIcon={<AppstoreOutlined />}
        menu={dropdownLinks.links.map((label, key) => ({
          key,
          label: <MenuWithDesc title={label.label} description={label.description} />,
        }))}
        active
        menuClassName={styles.menuOverlay}
        placement="bottom"
        onMenuItemClick={({ key }) => {
          window.open(dropdownLinks.links[parseInt(key)]?.link ?? '/', '_blank');
        }}
      />
    </div>
  );

  return (
    <Space>
      <>{leftElement}</>
      <>{sortedDropdownLinks}</>
      {showDivider && <Divider type="vertical" />}
    </Space>
  );
};

export interface MiddleHeaderProps {
  middleElement?: React.ReactNode;
  appNavigation?: AppNavigation[];
}
const MiddleHeader = ({ middleElement, appNavigation }: MiddleHeaderProps) => {
  const navigate = useNavigate();

  const sortedAppNavigation = !middleElement && appNavigation && (
    <Space className={styles.flexCenter}>
      {appNavigation.map((nav) => {
        if (nav.dropdown) {
          const dropdownMenu = nav.dropdown.map((menu) => ({ key: menu.link, label: menu.label }));
          return (
            <div key={nav.link} className={styles.appDropdown}>
              <Dropdown
                menu={dropdownMenu}
                label={nav.label}
                onMenuItemClick={({ key }) => {
                  if (isExternalLink(key)) {
                    window.open(key, '_blank');
                  } else {
                    navigate(key);
                  }
                }}
              />
            </div>
          );
        }
        return <div key={nav.link}>{renderLink(nav.link ?? '/', nav.label)}</div>;
      })}
    </Space>
  );

  return (
    <>
      <>{middleElement}</>
      <>{sortedAppNavigation}</>
    </>
  );
};

export const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  dropdownLinks,
  appNavigation,
  leftElement,
  middleElement,
  rightElement,
  children,
}) => {
  return (
    <Router>
      <div className={clsx(styles.header, styles.flexCenter, rightElement && styles.justifyAround)}>
        <div className={styles.flexCenter}>
          <div>
            <img src={Logo} alt="SubQuery Logo" width={140} />
          </div>

          <LeftHeader leftElement={leftElement} dropdownLinks={dropdownLinks} showDivider />
          <MiddleHeader middleElement={middleElement} appNavigation={appNavigation} />
        </div>

        <>{rightElement}</>
      </div>

      {children}
    </Router>
  );
};
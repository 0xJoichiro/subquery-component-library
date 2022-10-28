// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import clsx from 'clsx';
import { DropDownProps as AntdDropdownProps, Dropdown as AntdDropdown, Menu, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ItemType, MenuClickEventHandler } from 'rc-menu/lib/interface';
import styles from './Dropdown.module.css';
import { Typography } from '../typography';

export interface DropdownProps extends Partial<AntdDropdownProps> {
  label?: string;
  menu: ItemType[];
  menuClassName?: string;
  onMenuItemClick?: MenuClickEventHandler;
  LeftLabelIcon?: React.ReactElement;
  RightLabelIcon?: React.ReactElement;
  active?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  LeftLabelIcon,
  RightLabelIcon,
  menu,
  menuClassName,
  active,
  onMenuItemClick,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const sortedLabel = (
    <Space className={clsx(styles.pointer, (isOpen || active) && styles.isOnHover)}>
      {LeftLabelIcon}
      <Typography className={styles.colorInherit}>{label ?? 'Dropdown'}</Typography>
      {LeftLabelIcon ? undefined : RightLabelIcon ? RightLabelIcon : <DownOutlined />}
    </Space>
  );

  const sortedMenu = (
    <Menu
      onClick={(item) => {
        onMenuItemClick && onMenuItemClick(item);
        setIsOpen(false);
      }}
      items={menu}
      className={clsx('menuStyle', menuClassName)}
    />
  );

  return (
    <AntdDropdown
      {...props}
      overlay={sortedMenu}
      onOpenChange={(openStatus) => {
        setIsOpen(openStatus);
      }}
    >
      {sortedLabel}
    </AntdDropdown>
  );
};

export interface MenuWithDescProps {
  title: string;
  description: string;
}
export const MenuWithDesc = ({ title, description }: MenuWithDescProps) => {
  return (
    <>
      <Typography weight={500} className={styles.title}>
        {title}
      </Typography>
      <Typography variant="small" className={styles.description}>
        {description}
      </Typography>
    </>
  );
};

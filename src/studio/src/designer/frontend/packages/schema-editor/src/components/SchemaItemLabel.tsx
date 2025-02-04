import * as React from 'react';
import { IconButton, Menu, MenuItem, makeStyles } from '@material-ui/core';
import { getTranslation } from '../utils';
import { ILanguage } from '../types';

export interface SchemaItemLabelProps {
  icon: string;
  label: string;
  language: ILanguage;
  onAddProperty?: () => void;
  onDelete?: () => void;
  onImport?: () => void;
  onPromote?: () => void;
  onGoToType?: () => void;
}

const useStyles = makeStyles({
  contextButton: {
    borderRadius: 60,
    margin: 0,
    padding: 10,
    display: 'none',
    '.MuiTreeItem-root :hover > &': {
      display: 'block',
    },
  },
  propertiesLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    flexGrow: 1,
  },
  iconContainer: {
    background: '#022f51',
    textAlign: 'center',
    padding: '5px 0px 5px 0px',
    marginRight: 4,
    fontSize: '10px',
  },
});

export const SchemaItemLabel = (props: SchemaItemLabelProps) => {
  const [contextAnchor, setContextAnchor] = React.useState<any>(null);
  const classes = useStyles();
  const handleContextMenuClick = (e: React.MouseEvent) => {
    setContextAnchor(e.currentTarget);
    e.stopPropagation();
  };
  const handleAddPropertyClick = (e: React.MouseEvent) => {
    setContextAnchor(null);
    e.stopPropagation();
    props.onAddProperty?.();
  };
  const handlePromoteClick = (e: React.MouseEvent) => {
    setContextAnchor(null);
    e.stopPropagation();
    props.onPromote?.();
  };
  const handleDeleteClick = (e: React.MouseEvent) => {
    setContextAnchor(null);
    e.stopPropagation();
    props.onDelete?.();
  };
  const handleGoToType = (event: React.MouseEvent) => {
    setContextAnchor(null);
    event.stopPropagation();
    props.onGoToType?.();
  };

  const handleCloseContextMenu = (e: React.MouseEvent) => {
    setContextAnchor(null);
    e.stopPropagation();
  };
  return (
    <div className={classes.propertiesLabel}>
      <div className={classes.label}>
        <span className={classes.iconContainer}>
          <i className={`fa ${props.icon}`} style={{ color: 'white', textAlign: 'center' }} />
        </span> {props.label}
      </div>
      <IconButton
        className={classes.contextButton}
        aria-controls='simple-menu'
        aria-haspopup='true'
        id='open-context-menu-button'
        onClick={handleContextMenuClick}
      ><i className='fa fa-ellipsismenu'/>
      </IconButton>
      <Menu
        id='root-properties-context-menu'
        anchorEl={contextAnchor}
        open={Boolean(contextAnchor)}
        onClose={handleCloseContextMenu}
      >
        {props.onAddProperty && <MenuItem onClick={handleAddPropertyClick}><i className='fa fa-plus'/>{getTranslation('add_property', props.language)}</MenuItem>}
        {props.onImport && <MenuItem><i className='fa fa-clone'/> {getTranslation('import', props.language)}</MenuItem>}
        {props.onDelete && <MenuItem onClick={handleDeleteClick}><i className='fa fa-trash'/> {getTranslation('delete', props.language)}</MenuItem> }
        {props.onPromote && <MenuItem onClick={handlePromoteClick}><i className='fa fa-arrowup'/> {getTranslation('promote', props.language)}</MenuItem> }
        {props.onGoToType && <MenuItem onClick={handleGoToType}><i className='fa fa-datamodel-ref'/>{getTranslation('go_to_type', props.language)}</MenuItem> }
      </Menu>
    </div>);
};

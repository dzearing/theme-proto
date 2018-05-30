import * as React from 'react';
import { IStyle } from '@uifabric/styling';
import { createComponent, IStyleProps, IViewProps } from './createComponent';
import Text from './Text';
import Card from './Card';
import Stack from './Stack';
import { Icon, PersonaCoin } from 'office-ui-fabric-react';
import { Button } from './Button';

// Styles for the component
export interface ITaskCardStyles {
  root: IStyle;
}

// Inputs to the component
export interface ITaskCardProps {
  renderAs?: string | React.ReactType<ITaskCardProps>,
  children?: React.ReactNode;
  className?: string;

  paletteSet?: string;
}

const view = (props: IViewProps<ITaskCardProps, ITaskCardStyles>) => {
  const {
    renderAs: RootType = Card,
    classNames,
    ...rest
  } = props;

  return (
    <RootType {...rest} width={300} height={180} padding={20} className={classNames.root} data-is-focusable='true'>
      <Stack vertical fill>
        <Text emphasized>Portfolio Review</Text>
        <Text diminished>Design Studio</Text>
        <Stack vertical grow justify='end'>
        <Stack fill gapSize={8}>
          <Button text='normal' />
          <Button text='themed' primary={true}/>
        </Stack>
        </Stack>
        <Stack vertical grow justify='end'>
          <Stack align='center' fill gapSize={8}>
            <PersonaCoin text='David Zearing' size={2} />
            <Text>Peraaaaaason Namef dkalsfdsajkl fsadklj</Text>
            <Icon iconName='refresh' />
            <Icon iconName='lock' />
          </Stack>
        </Stack>
      </Stack>
    </RootType>
  );
};

const styles = (props: IStyleProps<ITaskCardProps, ITaskCardStyles>): ITaskCardStyles => {
  return {
    root: []
  };
};

export const TaskCard = createComponent<ITaskCardProps, ITaskCardStyles>({
  displayName: 'TaskCard',
  styles,
  view
});

export default TaskCard;

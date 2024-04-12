/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2016 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { ReactElement, ReactNode} from 'react';
import { useRef, useState } from 'react';

import { cssModules } from '../../bpk-react-utils';
import BpkSelectableChip, { BpkDismissibleChip, BpkIconChip, BpkDropdownChip, CHIP_TYPES } from '../../bpk-component-chip';
// @ts-expect-error Untyped import. See `decisions/imports-ts-suppressions.md`.
import BpkMobileScrollContainer from '../../bpk-component-mobile-scroll-container';
// @ts-expect-error Untyped import. See `decisions/imports-ts-suppressions.md`.
import FilterIconSm from '../../bpk-component-icon/sm/filter';
import BpkBreakpoint, { BREAKPOINTS } from '../../bpk-component-breakpoint';

import Nudger from './Nudger';

import STYLES from './BpkChipGroup.module.scss';

const getClassName = cssModules(STYLES);

export const CHIP_GROUP_TYPES = {
  rail: 'rail',
  wrap: 'wrap',
};


export const CHIP_COMPONENT = {
  selectable: 'selectable',
  dismissible: 'dismissible',
  dropdown: 'dropdown',
  icon: 'icon',
};

const CHIP_COMPONENT_MAP = {
  [CHIP_COMPONENT.selectable]: BpkSelectableChip,
  [CHIP_COMPONENT.dismissible]: BpkDismissibleChip,
  [CHIP_COMPONENT.dropdown]: BpkDropdownChip,
  [CHIP_COMPONENT.icon]: BpkIconChip,
}

export type ChipGroupType = (typeof CHIP_GROUP_TYPES)[keyof typeof CHIP_GROUP_TYPES];
export type ChipStyleType = (typeof CHIP_TYPES)[keyof typeof CHIP_TYPES];
export type ChipComponentType = (typeof CHIP_COMPONENT)[keyof typeof CHIP_COMPONENT];


export type SingleSelectChipItem = {
  text: string;
  accessibilityLabel?: string;
  leadingAccessoryView?: ReactNode;
  className?: string;
  [rest: string]: any; // Inexact rest. See decisions/inexact-rest.md
};

export type ChipItem = {
  component?: ChipComponentType;
  onClick?: (selected: boolean, index: number) => void;
  selected?: boolean;
  hidden?: boolean;
} & SingleSelectChipItem;

export type CommonProps = {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  type?: ChipGroupType;
  className?: string | null;
  chipStyle?: ChipStyleType;
};

export type ChipGroupProps = {
  chips: ChipItem[];
  stickyChip?: ChipItem;
  ariaMultiselectable?: boolean;
} & CommonProps;


const BpkChipGroup = ({
  ariaLabel,
  ariaLabelledBy,
  ariaMultiselectable = true,
  chipStyle = CHIP_TYPES.default,
  chips,
  className,
  stickyChip,
  type = CHIP_GROUP_TYPES.rail,
}: ChipGroupProps) => {
  if ((ariaLabel && ariaLabelledBy) || (!ariaLabel && !ariaLabelledBy)) {
    // eslint-disable-next-line no-console
    console.warn("BpkChipGroup: Bad combination of aria props. Exactly one of props ariaLabel or ariaLabelledBy should be used.")
  }

  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const containerClassnames = getClassName(
    className,
    'bpk-chip-group-container',
  )

  const chipGroupClassNames = getClassName(
    'bpk-chip-group',
    `bpk-chip-group--${type}`,
  );

  const stickyChipContainerClassnames = getClassName(
    'bpk-sticky-chip-container',
    `bpk-sticky-chip-container--${chipStyle}`,
  );

  const scrollContainerIndicator = getClassName('bpk-chip-group-scroller-indicator');

  const renderChipItem = ({
    accessibilityLabel,
    component = CHIP_COMPONENT.selectable,
    hidden = false,
    leadingAccessoryView = null,
    onClick,
    selected,
    text,
    ...rest
  }: ChipItem, index: number) => {
    const Component = CHIP_COMPONENT_MAP[component];
    return !hidden && (
      <Component
        key={text}
        selected={selected ?? false}
        type={chipStyle}
        accessibilityLabel={accessibilityLabel || text}
        onClick={() => {
          if (onClick) {
            onClick(!selected, index);
          }
        }}
        role="option"
        leadingAccessoryView={leadingAccessoryView}
        {...rest}
      >
        {text}
      </Component>
    );
  }

  // TODO: Fix focus indicators being cutoff when type = rail
  const wrapRailInScroll = (children: ReactElement) =>
    type === CHIP_GROUP_TYPES.rail ? (
      <BpkMobileScrollContainer
        scrollerRef={(el: HTMLElement) => {scrollContainerRef.current = el}}
        leadingIndicatorClassName={scrollContainerIndicator}
        trailingIndicatorClassName={scrollContainerIndicator}
      >
        {children}
      </BpkMobileScrollContainer>
    ) : children;

  return (
    <div className={containerClassnames}>
      {type === CHIP_GROUP_TYPES.rail && (
        <BpkBreakpoint query={BREAKPOINTS.ABOVE_TABLET}>
          <Nudger leading chipStyle={chipStyle} scrollContainerRef={scrollContainerRef} />
        </BpkBreakpoint>
      )}
      {type === CHIP_GROUP_TYPES.rail && stickyChip &&
        <div className={stickyChipContainerClassnames}>
          <BpkBreakpoint query={BREAKPOINTS.ABOVE_TABLET}>
            {(isDesktop) => renderChipItem({
              ...stickyChip,
              component: isDesktop ? CHIP_COMPONENT.selectable : CHIP_COMPONENT.icon,
              leadingAccessoryView: <FilterIconSm />,
            }, -1)}
          </BpkBreakpoint>
        </div>
      }
      {wrapRailInScroll(
        <div className={chipGroupClassNames}
         role="listbox"
         aria-orientation="horizontal"
         aria-multiselectable={ariaMultiselectable}
         aria-label={ariaLabel}
         aria-labelledby={ariaLabelledBy}
        >
          {chips.map((chip, index) => renderChipItem(chip, index))}
        </div>
      )}
      {type === CHIP_GROUP_TYPES.rail && (
        <BpkBreakpoint query={BREAKPOINTS.ABOVE_TABLET}>
          <Nudger chipStyle={chipStyle} scrollContainerRef={scrollContainerRef} />
        </BpkBreakpoint>
      )}
    </div>
  );
};

export const BpkChipGroupState = ({ chips, ...rest }: ChipGroupProps) => {
  const [selectedChips, setSelectedChips] = useState(chips.map(c => Boolean(c.selected)));

  const statefulChips = chips.map((chip, index) => chip && ({
    ...chip,
    selected: selectedChips[index],
    onClick: (selected: boolean, selectedIndex: number) => {
      if (chip.onClick) {
        chip.onClick(selected, selectedIndex);
      }

      const nextSelectedChips = [...selectedChips]
      nextSelectedChips[selectedIndex] = selected;
      setSelectedChips(nextSelectedChips);
    },
  }))

  return <BpkChipGroup chips={statefulChips} {...rest} />
};


export default BpkChipGroup;

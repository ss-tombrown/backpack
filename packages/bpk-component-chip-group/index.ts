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

import BpkChipGroup, {
  type ChipGroupProps,
  BpkChipGroupState,
  CHIP_GROUP_TYPES,
  type ChipItem,
  type SingleSelectChipItem,
  CHIP_COMPONENT,
} from './src/BpkChipGroup';
import BpkChipGroupSingleSelect, {
  type SingleSelectProps,
  type SingleSelectStateProps,
  BpkChipGroupSingleSelectState,
} from './src/BpkChipGroupSingleSelect';

export type { ChipGroupProps, SingleSelectProps, SingleSelectStateProps, ChipItem, SingleSelectChipItem };
export { BpkChipGroupState, CHIP_COMPONENT, CHIP_GROUP_TYPES, BpkChipGroupSingleSelect, BpkChipGroupSingleSelectState};
export default BpkChipGroup;

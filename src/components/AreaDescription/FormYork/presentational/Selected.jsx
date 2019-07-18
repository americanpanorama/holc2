import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from '../../containers/SimpleCategory';

const FormYorkSelected = ({ adData, selectCategory }) => (
  <ul>
    <SimpleCategory
      data={adData['19']}
      name="[Clarifying Remarks]"
      num={19}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['3']}
      name="Description"
      num={3}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['4']}
      name="Inhabitants"
      num={4}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['5']}
      name="Favorable Features"
      num={5}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['6']}
      name="Detrimental Features"
      num={6}
      bracketNum={true}
      selectCategory={selectCategory}
    />
  </ul>
);

FormYorkSelected.propTypes = {
  adData: PropTypes.object.isRequired,
  selectCategory: PropTypes.func.isRequired,
};

export default FormYorkSelected;

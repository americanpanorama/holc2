import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from '../../containers/SimpleCategory';

const FormYorkFull = ({ adData }) => (
  <ul>
    {(adData['1']) && (
      <SimpleCategory
        data={adData['1']}
        name="Security Grading"
        num={1}
        bracketedNum={true}
      />
    )}
    {(adData['2']) && (
      <SimpleCategory
        data={adData['2']}
        name="Location"
        num={2}
        bracketedNum={true}
      />
    )}
    {(adData['3']) && (
      <SimpleCategory
        data={adData['3']}
        name="Description"
        num={3}
        bracketedNum={true}
      />
    )}
    {(adData['4']) && (
      <SimpleCategory
        data={adData['4']}
        name="Inhabitants"
        num={4}
        bracketedNum={true}
      />
    )}
    {(adData['5']) && (
      <SimpleCategory
        data={adData['5']}
        name="Favorable"
        num={5}
        bracketedNum={true}
      />
    )}
    {(adData['6']) && (
      <SimpleCategory
        data={adData['6']}
        name="Detrimental"
        num={6}
        bracketedNum={true}
      />
    )}
    {(adData['7']) && (
      <SimpleCategory
        data={adData['7']}
        name="Land Vacancy"
        num={7}
        bracketedNum={true}
      />
    )}
    {(adData['8']) && (
      <SimpleCategory
        data={adData['8']}
        name="New Construction"
        num={8}
        bracketedNum={true}
      />
    )}
    {(adData['9']) && (
      <SimpleCategory
        data={adData['9']}
        name="Predominant Type of Structure"
        num={9}
        bracketedNum={true}
      />
    )}
    {(adData['10']) && (
      <SimpleCategory
        data={adData['10']}
        name="Predominant Age of Structure"
        num={10}
        bracketedNum={true}
      />
    )}
    {(adData['11']) && (
      <SimpleCategory
        data={adData['11']}
        name="Predominant Materials Used"
        num={11}
        bracketedNum={true}
      />
    )}
    {(adData['12']) && (
      <SimpleCategory
        data={adData['12']}
        name="General Condition"
        num={12}
        bracketedNum={true}
      />
    )}

    {(adData['16']) && (
      <li>
        <span className="catNum">
          [16]
        </span>
        <span className="catName">
          Occupancy
        </span>
        {(adData['16'].a) && (
          <SimpleSubcategory
            data={adData['16'].a}
            num={16}
            letter="a"
            name="Owner"
          />
        )}
        {(adData['16'].b) && (
          <SimpleSubcategory
            data={adData['16'].b}
            num={16}
            letter="b"
            name="Rental"
          />
        )}
      </li>
    )}

    {(adData['17']) && (
      <li>
        <span className="catNum">
          [17]
        </span>
        <span className="catName">
          Demand
        </span>
        {(adData['17'].a) && (
          <SimpleSubcategory
            data={adData['17'].a}
            num={17}
            letter="a"
            name="Sales"
          />
        )}
        {(adData['17'].b) && (
          <SimpleSubcategory
            data={adData['17'].b}
            num={17}
            letter="b"
            name="Rental"
          />
        )}
      </li>
    )}

    {(adData['18']) && (
      <SimpleCategory
        data={adData['18']}
        name="Sales"
        num={18}
        bracketedNum={true}
      />
    )}
    {(adData['19']) && (
      <SimpleCategory
        data={adData['19']}
        name="[Clarifying Remarks]"
        num={19}
        bracketedNum={true}
      />
    )}
  </ul>
);

FormYorkFull.propTypes = {
  adData: PropTypes.object.isRequired,
};

export default FormYorkFull;

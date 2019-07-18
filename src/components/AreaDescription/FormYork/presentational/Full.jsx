import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from '../../containers/SimpleCategory';
import SimpleSubcategory from '../../containers/SimpleSubcategory';

const FormYorkFull = ({ adData, selectCategory }) => (
  <ul>
    <SimpleCategory
      data={adData['1']}
      name="Security Grading"
      num={1}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['2']}
      name="Location"
      num={2}
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
      name="Favorable"
      num={5}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['6']}
      name="Detrimental"
      num={6}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['7']}
      name="Land Vacancy"
      num={7}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['8']}
      name="New Construction"
      num={8}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['9']}
      name="Predominant Type of Structure"
      num={9}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['10']}
      name="Predominant Age of Structure"
      num={10}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['11']}
      name="Predominant Materials Used"
      num={11}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['12']}
      name="General Condition"
      num={12}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <table>
      <thead>
        <tr>
          <th />
          <th>
            Real Estate Values
          </th>
          <th>
            Rentals
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            [13] Range
          </th>
          <td>
            {adData['13'].a}
          </td>
          <td>
            {adData['13'].b}
          </td>
        </tr>
        <tr>
          <th>
            [14] Shrinkage
          </th>
          <td>
            {adData['14'].a}
          </td>
          <td>
            {adData['14'].b}
          </td>
        </tr>
        <tr>
          <th>
            [15] Recovery
          </th>
          <td>
            {adData['15'].a}
          </td>
          <td>
            {adData['15'].b}
          </td>
        </tr>
      </tbody>
    </table>

    <li>
      <span className="catNum">
        [16]
      </span>
      <span className="catName">
        Occupancy
      </span>
      <SimpleSubcategory
        data={adData['16'].a}
        num={16}
        letter="a"
        name="Owner"
      />
      <SimpleSubcategory
        data={adData['16'].b}
        num={16}
        letter="b"
        name="Rental"
      />
    </li>
    <li>
      <span className="catNum">
        [17]
      </span>
      <span className="catName">
        Demand
      </span>
      <SimpleSubcategory
        data={adData['17'].a}
        num={17}
        letter="a"
        name="Sales"
      />
      <SimpleSubcategory
        data={adData['17'].b}
        num={17}
        letter="b"
        name="Rental"
      />
    </li>

    <SimpleCategory
      data={adData['18']}
      name="Sales"
      num={18}
      bracketNum={true}
      selectCategory={selectCategory}
    />
    <SimpleCategory
      data={adData['19']}
      name="[Clarifying Remarks]"
      num={19}
      bracketNum={true}
      selectCategory={selectCategory}
    />

  </ul>
);

FormYorkFull.propTypes = {
  adData: PropTypes.object.isRequired,
  selectCategory: PropTypes.func.isRequired,
};

export default FormYorkFull;

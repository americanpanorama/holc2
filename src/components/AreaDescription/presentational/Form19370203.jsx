import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from './SimpleCategory';
import SimpleSubcategory from './SimpleSubcategory';
import EmptyField from './EmptyField';

const Form19370203 = ({ adData }) => (
  <ul>
    <li>
      <span className="catNum">
        1
      </span>
      <span className="catName">
        Name of City
      </span>
      <span className="subcatData">
        {(adData[1] && adData[1][1]) ? adData[1][1] : <EmptyField /> }
      </span>
    </li>
    <li>
      <span className="catName indent">
        Security Grade
      </span>
      <span className="subcatData">
        {(adData[1] && adData[1][2]) ? adData[1][2] : <EmptyField /> }
      </span>
    </li>
    <li>
      <span className="catName indent">
         Area No.
      </span>
      <span className="subcatData">
        {(adData[1] && adData[1][3]) ? adData[1][3] : <EmptyField /> }
      </span>
    </li>
    <SimpleCategory
      data={adData['2']}
      num={2}
      name="Description of Terrain"
    />
    <SimpleCategory
      data={adData['3']}
      num={3}
      name="Favorable Influences"
    />
    <SimpleCategory
      data={adData['4']}
      num={4}
      name="Detrimental Influences"
    />
    <li>
      <span className="catNum">
        5
      </span>
      <span className="catName">
        Inhabitants
      </span>
      <ul>
        <SimpleSubcategory
          data={adData['5'].a}
          num={5}
          letter="a"
          name="Type"
        />
        <SimpleSubcategory
          data={adData['5'].b}
          num={5}
          letter="b"
          name="Estimated annual family income"
        />
        <li>
          <span
            className="catLetter catSelectable"
            //onClick={ this.props.onCategoryClick }
            id="5-c"
          >
            c
          </span>
          <span
            className="subcatName catSelectable"
            //onClick={ this.props.onCategoryClick }
            id="5-c"
          >
            Foreign-born
          </span>
          <span className="subcatData">
            { (adData[5] && adData[5].c['1']) ? adData[5].c['1'] : <EmptyField /> }
            {'; '}
            { (adData[5] && adData[5].c['2']) ? adData[5].c['2'] : <EmptyField /> }
          </span>
        </li>
        <li>
          <span
            className="catLetter catSelectable"
            //onClick={ this.props.onCategoryClick }
            id="5-d"
          >
            d
          </span>
          <span
            className="subcatName catSelectable"
            //onClick={ this.props.onCategoryClick }
            id="5-d"
          >
            Negro
          </span>
          <span className="subcatData">
            { (adData[5] && adData[5].d['1']) ? adData[5].d['1'] : <EmptyField /> }
            {'; '}
            { (adData[5] && adData[5].d['2']) ? adData[5].d['2'] : <EmptyField /> }
          </span>
        </li>
        <SimpleSubcategory
          data={adData['5'].e}
          num={5}
          letter="e"
          name="Infiltration of"
        />
        <SimpleSubcategory
          data={adData['5'].f}
          num={5}
          letter="f"
          name="Relief families"
        />
        <li>
          <span
            className="catLetter catSelectable"
            //onClick={ this.props.onCategoryClick }
            id="5-g"
          >
            g
          </span>
          <span
            className="subcatName catSelectable"
            //onClick={ this.props.onCategoryClick }
            id="5-g"
          >
            Population is increasing
          </span>
          <span className="subcatData">
            { (adData[5] && adData[5].g[1]) ? adData[5].g[1] : <EmptyField /> }
          </span>
          <span className="subcatName">
            {'; decreasing '}
          </span>
          <span className="subcatData">
            { (adData[5] && adData[5].g[2]) ? adData[5].g[2] : <EmptyField /> }
          </span>
          <span className="subcatName">
            ; static
          </span>
        </li>
      </ul>
    </li>
    <li>
      <span className="catNum">
        6
      </span>
      <span className="catName">
        Buildings
      </span>
      <ul>
        <SimpleSubcategory
          data={adData['6'].a}
          num={6}
          letter="a"
          name="Type or Types"
        />
        <SimpleSubcategory
          data={adData['6'].b}
          num={6}
          letter="b"
          name="Type of construction"
        />
        <SimpleSubcategory
          data={adData['6'].c}
          num={6}
          letter="c"
          name="Average age"
        />
        <SimpleSubcategory
          data={adData['6'].d}
          num={6}
          letter="d"
          name="Repair"
        />
      </ul>
    </li>
    <li>
      <span className="catNum">
        7
      </span>
      <span className="catName">
        History
      </span>
      <table>
        <thead>
          <tr>
            <th>
              Sales Values
            </th>
          </tr>
          <tr>
            <th>
              Year
            </th>
            <th>
              Range
            </th>
            <th>
              Predominating
            </th>
            <th>
              %
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              1929 level
            </th>
            <td>
              {(adData[7] && adData[7][1]) ? adData[7][1] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][2]) ? adData[7][2] : <EmptyField /> }
            </td>
            <td>
              100%
            </td>
          </tr>
          <tr>
            <th>
              {`${adData[7][5]} level`}
            </th>
            <td>
              {(adData[7] && adData[7][6]) ? adData[7][6] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][7]) ? adData[7][7] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][8]) ? adData[7][8] : <EmptyField /> }
            </td>
          </tr>
          <tr>
            <th>
              {`${adData[7][12]} level`}
            </th>
            <td>
              {(adData[7] && adData[7][13]) ? adData[7][13] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][14]) ? adData[7][14] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][15]) ? adData[7][15] : <EmptyField /> }
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>
              Rental Values
            </th>
          </tr>
          <tr>
            <th>
              Year
            </th>
            <th>
              Range
            </th>
            <th>
              Predominating
            </th>
            <th>
              %
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              1929 level
            </th>
            <td>
              {(adData[7] && adData[7][3]) ? adData[7][3] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][4]) ? adData[7][4] : <EmptyField /> }
            </td>
            <td>
              100%
            </td>
          </tr>
          <tr>
            <th>
              {`${(adData[7] && adData[7][5]) ? adData[7][5] : ''} level`}
            </th>
            <td>
              {(adData[7] && adData[7][9]) ? adData[7][9] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][10]) ? adData[7][10] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][11]) ? adData[7][11] : <EmptyField /> }
            </td>
          </tr>
          <tr>
            <th>
              {`${adData[7][12]} level`}
            </th>
            <td>
              {(adData[7] && adData[7][16]) ? adData[7][16] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][17]) ? adData[7][17] : <EmptyField /> }
            </td>
            <td>
              {(adData[7] && adData[7][18]) ? adData[7][18] : <EmptyField /> }
            </td>
          </tr>
        </tbody>
      </table>
      <div className="percentage">
        <span className="subcatName">
          Peak Sales values occurred in
        </span>
        <span className="subcatData">
          { (adData[7] && adData[7][19]) ? adData[7][19] : <EmptyField /> }
        </span>
        <span className="subcatName">
          {' and were '}
        </span>
        <span className="subcatData">
          { (adData[7] && adData[7][20]) ? adData[7][20] : <EmptyField /> }
        </span>
        <span className="subcatName">
          '% of the 1929 level.
        </span>
      </div>
      <div className="percentage">
        <span className="subcatName">
          Peak rental values occurred in
        </span>
        <span className="subcatData">
          { (adData[7] && adData[7][21]) ? adData[7][21] : <EmptyField /> }
        </span>
        <span className="subcatName">
          {' and were '}
        </span>
        <span className="subcatData">
          { (adData[7] && adData[7][22]) ? adData[7][22] : <EmptyField /> }
        </span>
        <span className="subcatName">
          % of the 1929 level.
        </span>
      </div>
    </li>
    <li>
      <span className="catNum">
        8
      </span>
      <span className="catName">
        Occupancy
      </span>
      <ul>
        <SimpleSubcategory
          data={adData['8'].a}
          num={8}
          letter="a"
          name="Land"
        />
        <SimpleSubcategory
          data={adData['8'].b}
          num={8}
          letter="b"
          name="Dwelling units"
        />
        <SimpleSubcategory
          data={adData['8'].c}
          num={8}
          letter="c"
          name="Home Owners"
        />
      </ul>
    </li>
    <li>
      <span className="catNum">
        9
      </span>
      <span className="catName">
        Sales Demand
      </span>
      <ul>
        <SimpleSubcategory
          data={adData['9'].a}
          num={9}
          letter="a"
          name=""
        />
        <SimpleSubcategory
          data={adData['9'].b}
          num={9}
          letter="b"
          name=""
        />
        <SimpleSubcategory
          data={adData['9'].c}
          num={9}
          letter="c"
          name="Activity is"
        />
      </ul>
    </li>
    <li>
      <span className="catNum">
        10
      </span>
      <span className="catName">
        Rental Demand
      </span>
      <ul>
        <SimpleSubcategory
          data={adData['10'].a}
          num={10}
          letter="a"
          name=""
        />
        <SimpleSubcategory
          data={adData['10'].b}
          num={10}
          letter="b"
          name=""
        />
        <SimpleSubcategory
          data={adData['10'].c}
          num={10}
          letter="c"
          name="Activity is"
        />
      </ul>
    </li>
    <li>
      <span className="catNum">
        11
      </span>
      <span className="catName">
        New Construction
      </span>
      <ul>
        <SimpleSubcategory
          data={adData['11'].a}
          num={11}
          letter="a"
          name="Types"
        />
        <SimpleSubcategory
          data={adData['11'].b}
          num={11}
          letter="b"
          name="Amount last year"
        />
      </ul>
    </li>
    <li>
      <span className="catNum">
        12
      </span>
      <span className="catName">
        Availability of Mortgage Funds
      </span>
      <ul>
        <SimpleSubcategory
          data={adData['12'].a}
          num={12}
          letter="a"
          name="Home purchase"
        />
        <SimpleSubcategory
          data={adData['12'].b}
          num={12}
          letter="b"
          name="Home building"
        />
      </ul>
    </li>
    <SimpleCategory
      data={adData['13']}
      num={13}
      name="Trend of Desireability Next 10-15 Years"
    />
    <SimpleCategory
      data={adData['14']}
      num={14}
      name="Clarifying Remarks"
    />
    <li>
      <span className="catNum">
        15
      </span>
      <span className="catName">
        Information for this form was obtained from
      </span>
      <span className="subcatData">
        {(adData[15] && typeof adData[15] === 'string')
          ? adData[15]
          : (adData[15] && adData[15][1])
          ? adData[15][1]
          : <EmptyField />}
      </span>
    </li>
    { (typeof adData[15] === 'object') && (
      <li>
        <span className="catName indent">
          Date
        </span>
        <span className="subcatData">
          { (adData[15] && adData[15][2]) ? adData[15][2] : <EmptyField /> }
        </span>
        <span className="catName indent">
          193
        </span>
        <span className="subcatData">
          { (adData[15] && adData[15][3]) ? adData[15][3] : <EmptyField /> }
        </span>
      </li>
    )}
  </ul>
);

Form19370203.propTypes = {
  adData: PropTypes.object.isRequired,
};

export default Form19370203;

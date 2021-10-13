import React from 'react';
import PropTypes from 'prop-types';
import NeighborhoodMap from '../../AreaDescription/presentational/NeighborhoodMap';

const Introduction = ({selectArea}) => (
  <div className="intro">
    <h2>
      Introduction
    </h2>
    <p>
      Among the thousands of area descriptions created by agents of the federal government's Home Owners' Loan Corporation between 1935 and 1940, the one that was written for what is now called the Carver Heights neighborhood in Savannah, Georgia, stands out. HOLC staff members, using data and evaluations organized by local real estate professionals—lenders, developers, and real estate appraisers—in each city, assigned grades to residential neighborhoods that reflected their "mortgage security" that would then be visualized on color-coded maps. Neighborhoods receiving the highest grade of "A"—colored green on the maps—were deemed minimal risks for banks and other mortgage lenders when they were determining who should received loans and which areas in the city were safe investments. Those receiving the lowest grade of "D," colored red, were considered "hazardous." 
    </p>
    <figure>
      <img src='./static/decatur.jpg' />
      <figcaption>
        HOLC's map for Decatur, Illinois
      </figcaption>
    </figure>
    <p>
      Conservative, responsible lenders, in HOLC judgment, would "refuse to make loans in these areas [or] only on a conservative basis." HOLC created area descriptions to help to organize the data they used to assign the grades. Among that information was the neighborhood's quality of housing, the recent history of sale and rent values, and, crucially, the racial and ethnic identity and class of residents that served as the basis of the neighborhood's grade. These maps and their accompanying documentation helped set the rules for nearly a century of real estate practice.
    </p>
    <p>
      To return to Savannah, HOLC's agents there described the residents of Carver Heights as "
      <span
        className="link"
        onClick={selectArea}
        id="37-C12"
      >
        a fair class of negroes and low type of white
      </span>
      ."
      Originally, they assigned a grade of "D" to Carver Heights. But their "consensus of opinion later changed" and they gave it a "C." The change of grade followed from a change of perspective. They made an effort to not just see the neighborhood from their perspective as white men. "In other words," they explained in the neighborhood's area description, "it was considered from a negro standpoint of home ownership, rather than a white, since there are more negroes than whites in the neighborhood."
    </p>

    <p>
      Making an effort to consider anything from a "negro standpoint" is what made the work of Savannah's agents unique among the massive amount of materials from HOLC visualized and organized in <cite>Mapping Inequality</cite>. Arguably the HOLC agents in the other two hundred-plus cities graded through this program adopted a consistently white, elite standpoint or perspective. HOLC assumed and insisted that the residency of African Americans and immigrants, as well as working-class whites, compromised the values of homes and the security of mortgages. In this they followed the guidelines set forth by Frederick Babcock, the central figure in early twentieth-century real estate appraisal standards, in his <cite>Underwriting Manual</cite>: "
        <a 
          href="https://hdl.handle.net/2027/mdp.39015018409246?urlappend=%3Bseq=89"
          target="_blank"
        >
          The infiltration of inharmonious racial groups ... tend to lower the levels of land values and to lessen the desirability of residential areas
        </a>
       ."
    </p>

    <p>
      As you explore the materials Mapping Inequality, you will quickly encounter exactly that kind of language, descriptions of the "infiltration" of what were quite often described as "subversive," "undesirable," "inharmonious," or "lower grade" populations, for they are everywhere in the HOLC archive. Of the Bedford–Stuyvesant in Brooklyn, for instant, agents explained that "
      <span
        className="link"
        onClick={selectArea}
        id="99-D8"
      >
        Colored infiltration a definitely adverse influence on neighborhood desirability although Negroes will buy properties at fair prices and usually rent rooms
      </span>
      ."
      In the Tompkinsville neighborhood in Staten Island, "
      <span
        className="link"
        onClick={selectArea}
        id="107-D3"
      >
        Italian infiltration depress residential desirability in this area
      </span>
      ." In a south Philadelphia neighborhood "
      <span
        className="link"
        onClick={selectArea}
        id="138-C14"
      >
        Infiltration of Jewish into area have depressed values
      </span>
      ." The assessors of a Minneapolis neighborhood attributed the decline of a "
      <span
        className="link"
        onClick={selectArea}
        id="81-D6"
      >
        once a very substantial and desirable area" to the "gradual infiltration of negroes and Asiatics
      </span>
      ." In Berkeley, California, an area north of UC Berkeley "
      <span
        className="link"
        onClick={selectArea}
        id="17-D2"
      >
        could be classed as High Yellow [C], but for infiltration of Orientals and gradual infiltration of Negroes form south to north
      </span>
      ." Such judgments were made in cities from every region of the country. The "infiltration of negroes" informed the grades of neighborhoods in
      {' '}
      <span
        className="link"
        onClick={selectArea}
        id="10-D5"
      >
        Birmingham
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="17-C2"
      >
        Oakland
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="91-A2"
      >
        Charlotte
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="125-C17"
      >
        Youngstown
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="53-D26"
      >
        Indianapolis
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="115-D26"
      >
        Cleveland
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="16-C125"
      >
        Los Angeles
      </span>
      {', and '}
      <span
        className="link"
        onClick={selectArea}
        id=""
      >
        Chicago
      </span>
      ; the "infiltration of Jews" or "infiltration of Jewish families" in
      {' '}
      <span
        className="link"
        onClick={selectArea}
        id="16-C77"
      >
        Los Angeles
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="194-C6"
      >
        Binghamton
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="226-C32"
      >
        Kansas City
      </span>
      {', and '}
      <span
        className="link"
        onClick={selectArea}
        id="45-C276"
      >
        Chicago
      </span>
      ; the "infiltration of Italians" in
      {' '}
      <span
        className="link"
        onClick={selectArea}
        id="114-C8"
      >
        Akron
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="45-C103"
      >
        Chicago
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="115-D25"
      >
        Cleveland
      </span>
      {', and '}
      <span
        className="link"
        onClick={selectArea}
        id="226-C42"
      >
        Kansas City
      </span>
      . The infiltration of
      {' '}
      <span
        className="link"
        onClick={selectArea}
        id="115-C54"
      >
        Polish
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="114-C20"
      >
        Hungarian
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="45-B93"
      >
        Czech
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="10-C3"
      >
        Greek
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="19-C2"
      >
        Mexican
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="115-D12"
      >
        Russian
      </span>
      {', '}
      <span
        className="link"
        onClick={selectArea}
        id="114-C23"
      >
        Slavic
      </span>
      {', and '}
      <span
        className="link"
        onClick={selectArea}
        id="115-D6"
      >
        Syrian
      </span>
      {' '}
      families was cataloged in other cities, always lowering the grade of neighborhoods.
    </p>
  {/* JSX Comment 
    <NeighborhoodMap
      holcId="D8"
      adId={99}
      bounds={[
              [
                40.672,
                -73.958
              ],
              [
                40.697,
                -73.918
              ]
            ]}
      highlightedAdId={99}
      highlightedHolcId="D8"
      basemap="https://api.mapbox.com/styles/v1/ur-dsl/cjtyox5ms3ycd1flvhg7kihdi/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXItZHNsIiwiYSI6ImNqdGs3MHhxdDAwd2E0NHA2bmxoZjM1Y2IifQ.y1wfhup4U2U8KvHuOpFCng"
      neighborhoodRasterParams={{
              url: "//s3.amazonaws.com/holc/polygon_tiles/2722/{z}/{x}/{y}.png",
              maxNativeZoom: 15
            }}
      style={{
              right: 410
            }}
    
    />
    <NeighborhoodMap
      holcId="C14"
      adId={138}
      bounds={[
    [
      39.93,
      -75.248
    ],
    [
      39.963,
      -75.192
    ]
  ]}
      highlightedAdId={138}
      highlightedHolcId="C14"
      basemap="https://api.mapbox.com/styles/v1/ur-dsl/cjtyox5ms3ycd1flvhg7kihdi/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXItZHNsIiwiYSI6ImNqdGs3MHhxdDAwd2E0NHA2bmxoZjM1Y2IifQ.y1wfhup4U2U8KvHuOpFCng"
      neighborhoodRasterParams={{
              url: "//s3.amazonaws.com/holc/polygon_tiles/5659/{z}/{x}/{y}.png",
              maxNativeZoom: 15
            }}
    
    />

    */}

    <p>
      These grades were a tool for redlining: making it difficult or impossible for people in certain areas to access mortgage financing and thus become homeowners. Redlining directed both public and private capital to native-born white families and away from African American and immigrant families. As homeownership was arguably the most significant means of intergenerational wealth building in the United States in the twentieth century, these redlining practices from eight decades ago had long-term effects in creating wealth inequalities that we still see today. <cite>Mapping Inequality</cite>, we hope, will allow and encourage you to grapple with this history of government policies contributing to inequality.
    </p>

    <h3>Archiving Inequality for the Digital Age</h3>
    <p>Like so many other government agencies during the New Deal, HOLC and its parent bureau, the Federal Home Loan Bank Board, shaped Americans' lives and livelihoods profoundly during and after the Great Depression of the 1930s. Both proved critical to protecting and expanding home ownership, to standardizing lending practices, and to encouraging residential and commercial real estate investment in a flagging economy.  Across the middle third of the twentieth century, arguably the most prosperous decades in American history, these agencies worked with public and private sector partners to create millions of jobs and help millions of Americans buy or keep their homes. At the very same time, federal housing programs helped codify and expand practices of racial and class segregation.  They ensured, moreover, that rampant real estate speculation and environmental degradation would accompany America's remarkable economic recovery and growth.</p>
    <p><cite>Mapping Inequality</cite> brings one of the country's most important archives to the public.  HOLC's documents contain a wealth of information about how government officials, lenders, and real estate interests surveyed and ensured the economic health of American cities.  And with the help of ongoing research, we continue to learn at what cost such measures were realized.</p>
    <p>Over the last thirty years especially, scholars have characterized HOLC's property assessment and risk management practices, as well as those of the Federal Housing Administration, Veterans Administration, and US. Housing Authority, as some of the most important factors in preserving racial segregation, intergenerational poverty, and the continued wealth gap between white Americans and most other groups in the U.S.  Many of these agencies operated under the influence of powerful real estate lobbies or wrote their policies steeped in what were, at the time, widespread assumptions about the profitability of racial segregation and the residential incompatibility of certain racial and ethnic groups.  Through HOLC, in particular, real estate appraisers used the apparent racial and cultural value of a community to determine its economic value.  <cite>Mapping Inequality</cite> offers a window into the New Deal era housing policies that helped set the course for contemporary America. This project provides visitors with a new view, and perhaps even a new language, for describing the relationship between wealth and poverty in America.</p>

    <h2>Bibliographic Note</h2>
    <p>The Home Owners Loan Corporation (HOLC) has long been seen as both a savior to the housing sector and a force for racial segregation.  As the economic collapse of the 1930s recedes beyond living memory, historians have focused more on the segregationist nature of housing policy—how racism helped save the American economy.  The legislation creating HOLC came out of the first 100 days of the Roosevelt administration and provided billions of dollars for the rescue of banks, thrifts, and distressed homeowners.  New Deal legislation was highly popular in the midst of an economic crisis—the Democratically-controlled House of Representatives passed the bill 383-4.</p>
    <p>HOLC helped restructure the American mortgage lending market by creating and standardizing several of its elements.  HOLC incorporated appraisal of home value into its lending processes, a practice only in its infancy at the time.  HOLC supported the training of home appraisers and employed hundreds of appraisers throughout the 1930s, working in concert with the nation’s realtors to inaugurate and advance real estate appraisal as a profession.  HOLC’s department of Research and Statistics drew upon its network of realtors, developers, lenders, and appraisers to create a neighborhood-by-neighborhood assessment of more than 200 cities in the country.  These assessments included demographic data, economic reports, and the color-coded Security Maps later deemed infamous as instruments of “redlining.”</p>
    <p>The mainstream white press—major daily newspapers and periodicals—greeted the agency and its programs with approval.  They explained the program and forecast upturns in the real estate and construction sectors, as the program enjoyed popular support.  In Chicago, seventeen thousand people stood in line at HOLC’s office the first day it opened in August of 1933 to inquire or apply for aid.  The corporation’s main lending phase ended after three years and the corporation receded from mainstream public view.  HOLC slowly reduced its operations during the 1940s to manage the loans and homes it acquired in its key phase of activity.</p>
    <p>African Americans lambasted HOLC staffing decisions and infrastructure that favored white homeowners and businesses at the expense of blacks.  However, discussion in black newspapers, such as the <cite>Chicago Defender</cite>, prompted only modest response by policy and media elites.  The Roosevelt administration rebuffed NAACP concerns about restrictive covenants, even when HOLC redlining was exposed in 1938.  Black housing officials often worked incrementally on a host of issues, including ending white terrorism and getting new black housing built, even if that meant operating within the segregationist strictures of federal policy.  Racial segregation in housing was not formally deemed illegal until the Fair Housing Act of 1968.</p>
    <p>Scholars viewed HOLC favorably, shaped by economist C. Lowell Harriss’ <cite>History and Policies of the Home Owners’ Loan Corporation</cite>, published in 1951 as the federal government unwound the agency.  HOLC had refinanced a million homes and returned a profit of $14 million to the U.S. Treasury.  It was a successful business venture for an agency created as emergency relief that helped stabilize and even resurrect a moribund mortgage market and stagnant home building sector.</p>
    <p>In the 1980s discovery of the HOLC security maps changed the way historians thought about HOLC and New Deal housing policy.  Housing activists in the 1960s and 1970s had criticized and protested discrimination in real estate lending and buying, coining the term “redlining” to illustrate the geographic dimensions of housing discrimination.  Historian Kenneth Jackson found the maps in the National Archives, stating in his award-winning book <cite>Crabgrass Frontier</cite> that HOLC “devised a rating system that undervalued neighborhoods that were dense, mixed, or aging,” and rather than creating racial discrimination, “applied [existing] notions of ethnic and racial worth to real-estate appraising on an unprecedented scale.”  Federal housing policy simply blocked African Americans from accessing real estate capital, leading to the creation of segregated mass suburbia and, neighborhood by neighborhood, opened residents to opportunity and wealth accumulation or closed citizens off from the American dream.  Following Jackson’s work, historian Thomas Sugrue wrote of the legacy of federal housing policy in Detroit: “geography is destiny.”  Outside of history, scholars and journalists, including sociologist Douglas Massey and writer Ta-Nehisi Coates, point to HOLC redlining as a key factor in racial disparities in wealth and opportunity that continue to the present day.</p>
    <p>When historians incorporated new data technology in their research, they began to draw new conclusions about HOLC’s legacy.  Mapping with geographic information systems (GIS) and quantitative statistical methods from the social sciences, scholars including Amy Hillier and James Greer have countered Jackson’s initial assessment.  Some African Americans did gain access to HOLC financing, and a neighborhood rating was neither a blanket guarantee nor proscription for New Deal aid—“C” and “D”-rated neighborhoods often received more mortgages than nearby “A” neighborhoods.  The ability to work with digital data and to transmit information over the web has opened many new avenues for scholarly inquiry, including assessing the importance of restrictive covenants and asking research questions about the whole program, rather than just individual cities.  Managing massive amounts of real estate and demographic data has been a herculean task up until recently but is now possible with mapping, visualization, and statistical tools.</p>
    <p><cite>Mapping Inequality</cite> opens the HOLC files at the National Archives to scholars, students, and residents and policy leaders in local communities.  This site makes the well-known security maps of HOLC available in digital form, as well as the data and textual assessments of the area descriptions that were created to go with the maps.  By bringing study of HOLC into the digital realm, <cite>Mapping Inequality</cite> embraces a big data approach that can simultaneously give a national view of the program or a neighborhood-level assessment of the 1930s real estate rescue.  Project researchers are providing access to some of the digital tools and interactive resources they are using in their own research, in the hope that the public will be able to understand the effects of federal housing policy and local implementation in their own communities.</p>
    <h2>Bibliography</h2>
    <h3>Textbooks and Manuals on Home Appraisal and Valuation</h3>
    <ul>
    <li><cite>FHA Underwriting Manual</cite> (Washington, DC: Federal Housing Administration, 1936).</li>
    <li>Frederick Babcock, <cite>The Valuation of Real Estate</cite> (McGraw Hill Book Co.: New York, 1932).</li>
    <li>Richard Ely and George Wehrwein, <cite>Land Economics</cite> (Madison, WI: University of Wisconsin Press, rev. 1964).</li>
    <li>Ernest Fisher, <cite>Principles of Real Estate Practice</cite> (New York: The MacMillan Co., 1924).</li>
    <li>Richard Hurd, <cite>Principles of City Land Values </cite>(New York: The Record and Guide, 1924).</li>
    </ul>
    <h3>Contemporaneous Studies of HOLC and Racial Segregation</h3>
    <ul>
    <li>Charles Abrams, <cite>Forbidden Neighbors: A Study of Prejudice in Housing </cite>(New York: Harper &amp; Brothers, 1955).</li>
    <li>C. Lowell Harriss, <cite>History and Policies of the Home Owners&rsquo; Loan Corporation</cite> (Washington, D.C., National Bureau of Economic Research, 1951).</li>
    <li>Robert C. Weaver, <cite>The Negro Ghetto </cite>(New York: Harcourt, Brace, 1948).</li>
    </ul>
    <h3>Historical Studies of HOLC, Segregation, and Home Finance</h3>
    <ul>
    <li>Price Fishback, Jonathan Rose, and Kenneth Snowden, <cite>Well Worth Saving: How the New Deal Safeguarded Homeownership</cite> (Chicago: Unversity of Chicago Press, 2013).</li>
    <li>David M. P. Freund, <cite>Colored Property: State Policy and White Racial Politics in Suburban America</cite> (Chicago: University of Chicago Press, 2007).</li>
    <li>Margaret Garb, <cite>City of American Dreams: A History of Home Ownership and Housing Reform in Chicago, 1871-1919</cite>.&nbsp; (Chicago: University of Chicago Press, 2005).</li>
    <li>Amy E. Hillier, &ldquo;Redlining and the Home Owners&rsquo; Loan Corporation,&rdquo; <cite>Journal of Urban History</cite> 29 (May 2003): 394-420.</li>
    <li>Amy E. Hillier, &ldquo;Residential Security Maps and Neighborhood Appraisals: The Home Owners&rsquo; Loan Corporation and the Case of Philadelphia,&rdquo; <cite>Social Science History</cite> 29 (Summer 2005): 207-233.</li>
    <li>Amy E. Hillier, &ldquo;Searching for Red Lines: Spatial Analysis of Lending Patterns in Philadelphia, 1940-1960,&rdquo; <cite>Pennsylvania History</cite> 72 (Winter 2005): 25-47.</li>
    <li>Amy E. Hillier, &ldquo;Who Received Loans? Home Owners' Loan Corporation Lending and Discrimination in Philadelphiain the 1930s,&rdquo; <cite>Journal of Planning History</cite> 2 (February 2003): 3-24.</li>
    <li>Arnold R. Hirsch, &ldquo;Containment on the Home Front: Race and Federal Housing Policy from the New Deal to the Cold War,&rdquo; <cite>Journal of Urban History</cite> 26, no. 2 (January 2000): 158-189.</li>
    <li>Kenneth T. Jackson, &ldquo;Race Ethnicity, and Real Estate Appraisal: The Home Owners Loan Corporation and the Federal Housing Administration,&rdquo; <cite>Journal of Urban History</cite> 6 (August 1980): 419-452.</li>
    <li>Kenneth T. Jackson, <cite>Crabgrass Frontier: The Suburbanization of the United States</cite> (Oxford: Oxford University Press, 1985).</li>
    <li>Jennifer S. Light, &ldquo;Nationality and Neighborhood Risk at the Origins of FHA Underwriting,&rdquo; <cite>Journal of Urban History</cite> 36 (June 2010): 634-671.</li>
    <li>Todd M. Michney and LaDale Winling, "New Perspectives on New Deal Housing Policy: Explicating and Mapping HOLC Loans to African Americans," <cite>Journal of Urban History</cite> preprint (January 9, 2019).</li>
    <li>Louis Lee Woods II, &ldquo;The Federal Home Loan Bank Board, Redlining, and the National Proliferation of Racial Lending Discrimination, 1921-1950,&rdquo; <cite>Journal of Urban History</cite> 38 (November 2012): 1036-1059.</li>
    </ul>
    <h3>Historical Community Studies Featuring Analysis of HOLC</h3>
    <ul>
    <li>Wendell Pritchett, <cite>Brownsville, Brooklyn: Blacks, Jews, and the Changing Face of the Ghetto </cite>(Chicago: University of Chicago Press, 2002).</li>
    <li>Beryl Satter, <cite>Family Properties: Race, Real Estate, and the Exploitation of Black Urban America</cite> (Metropolitan Books, 2009).</li>
    <li>Robert O. Self, <cite>American Babylon, Race and the Struggle for Postwar Oakland</cite> (Princeton: Princeton University Press, 2003).</li>
    <li>Thomas J. Sugrue, <cite>Origins of the Urban Crisis: Race and Inequality in Postwar Detroit</cite> (Princeton: Princeton University Press, 1996).</li>
    <li>Craig Steven Wilder, <cite>Covenant With Color: Race and Social Power in Brooklyn</cite> (New York: Columbia University Press, 2001).</li>
    </ul>
    <h3>Sociological Studies of Racial Discrimination and Segregation</h3>
    <ul>
    <li>Rose Helper, <cite>Racial Policies and Practices of Real Estate Brokers</cite>. (Minneapolis: University of Minnesota Press, 1969).</li>
    <li>Douglas S. Massey and Nancy A. Denton, <cite>American Apartheid: Segregation and the Making of the Underclass</cite> (Cambridge: Harvard University Press, 1993).</li>
    </ul>
  </div>
);

export default Introduction;

Introduction.propTypes = {
  selectArea: PropTypes.func.isRequired,
};

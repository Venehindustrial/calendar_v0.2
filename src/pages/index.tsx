import React, { useState, useMemo } from 'react';
import { Box } from 'grommet';
import { graphql, useStaticQuery } from 'gatsby';
// import GithubCorner from '../components/GithubCorner';
import Footer from '../components/Footer';
import ModalEvent from '../components/ModalEvent';
import Month from '../components/Calendar/Month';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import groupEventsByMonth from '../utils/groupEventsByMonth';
import { format } from 'date-fns';

// override this query with your own questions!
const SPREADSHEET_QUERY = graphql`
  query eventsQuery {
    site {
      siteMetadata {
        limitMonthInTheFuture
      }
    }
    allGoogleEventsSheet {
      edges {
        nodes {
          id
          namePublisher: aName
          emailPublisher: aEmail
          eventName: eDenomination
          date: when
          hour: whentime
          typeEvent: eType
          eventLink: eLink
          form: efLink
          specialist: exhibitor
        }
      }
    }
  }
`;

const CalendarPage = () => {
  const [modalData, setModalData] = useState<ModalData>();

  // Use a try-catch or conditional rendering for the query
  let queryData;
  try {
    queryData = useStaticQuery(SPREADSHEET_QUERY);
  } catch (error) {
    console.error('Primary query failed, this might be expected:', error);
    // You could try alternative queries here
  }

  // Fallback if no data is available
  if (!queryData || !queryData.allGoogleEventsSheet) {
    return (
      <Layout>
        <Hero />
        <Box pad="large" align="center">
          <h2>Unable to load events data</h2>
          <p>Please check your Google Sheets configuration and try again.</p>
          <p>Debug info:</p>
          <ul>
            <li>Make sure your Google Sheet is public</li>
            <li>Verify your Google API key is set</li>
            <li>Check the console for detailed error messages</li>
            <li>Visit http://localhost:8000/___graphql to explore available fields</li>
          </ul>
        </Box>
        <Footer />
      </Layout>
    );
  }

  const { allGoogleEventsSheet, site } = useStaticQuery(SPREADSHEET_QUERY);
  const { limitMonthInTheFuture } = site.siteMetadata;

  const months = useMemo(
    () => groupEventsByMonth(allGoogleEventsSheet.nodes, limitMonthInTheFuture),
    [allGoogleEventsSheet.nodes, limitMonthInTheFuture],
  );

  return (
    <Layout>
      <Hero />
      
      <Box id="calendars" animation="fadeIn">
        {months.length > 0 ? (
          months.map((month) => (
            <Month
              key={format(month.startDate, 'MM')}
              openModal={(data: ModalData) => setModalData(data)}
              {...month}
            />
          ))
        ) : (
          <Box pad="large" align="center">
            <h3>No events found</h3>
            <p>There are currently no events to display.</p>
          </Box>
        )}
      </Box>
    
      {modalData && (
        <ModalEvent onClose={() => setModalData(undefined)} {...modalData} />
      )}
    
      <Footer />
    </Layout>
  );
};

// Originalmente esto se encontraba antes del cierre de la Meta etiqueta Footer
// <GithubCorner href="https://github.com/EmaSuriano/gatsby-starter-event-calendar" />
export default CalendarPage;

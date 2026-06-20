import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register a standard font if needed, or use default standard fonts
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contact: {
    fontSize: 10,
    color: '#333333',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  itemGroup: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  itemCompany: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  itemDate: {
    fontSize: 10,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  skills: {
    fontSize: 10,
    lineHeight: 1.5,
  }
});

export const ResumePDF = ({ data }: { data: any }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.name || "Professional"}</Text>
          <View style={styles.contact}>
            {personalInfo?.email && <Text>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text>• {personalInfo.phone}</Text>}
            {personalInfo?.location && <Text>• {personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text>• {personalInfo.linkedin}</Text>}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp: any, i: number) => (
              <View key={i} style={styles.itemGroup}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.title} {exp.company && <Text style={styles.itemCompany}>| {exp.company}</Text>}</Text>
                  <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate || "Present"}</Text>
                </View>
                {exp.location && <Text style={{ fontSize: 10, marginBottom: 4, fontStyle: 'italic', color: '#666' }}>{exp.location}</Text>}
                
                {exp.description && exp.description.map((desc: string, j: number) => (
                  <View key={j} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{desc}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, i: number) => (
              <View key={i} style={styles.itemGroup}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemDate}>{edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}</Text>
                </View>
                <Text style={styles.itemCompany}>{edu.institution}{edu.location ? `, ${edu.location}` : ""}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <Text style={styles.skills}>{skills.join(' • ')}</Text>
          </View>
        )}

      </Page>
    </Document>
  );
};

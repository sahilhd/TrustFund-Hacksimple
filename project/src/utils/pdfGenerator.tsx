import { TrustFundData } from '../types/trust';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register Times New Roman font
Font.register({
  family: 'Times-Roman',
  fonts: [
    { src: 'https://fonts.cdnfonts.com/css/times-new-roman' },
    { src: 'https://fonts.cdnfonts.com/css/times-new-roman', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Times-Roman',
  },
  section: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: 'bold',
    fontFamily: 'Times-Roman',
  },
  subheading: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'Times-Roman',
  },
  field: {
    marginBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 'bold',
    width: '30%',
  },
  value: {
    width: '70%',
  },
  declaration: {
    marginTop: 30,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureLine: {
    width: '45%',
    borderBottom: 1,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
});

const TrustDocument = ({ data }: { data: TrustFundData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.title}>
        <Text>TRUST DEED</Text>
      </View>
      <View style={styles.subtitle}>
        <Text>This Trust Deed is made on {format(new Date(), 'MMMM dd, yyyy')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>1. SETTLOR INFORMATION</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{data.settlor.fullName}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{format(new Date(data.settlor.dateOfBirth), 'MMMM dd, yyyy')}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>SIN:</Text>
          <Text style={styles.value}>{data.settlor.sin}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data.settlor.address}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{data.settlor.phone} | {data.settlor.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>2. TRUSTEE INFORMATION</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{data.trustee.fullName}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{format(new Date(data.trustee.dateOfBirth), 'MMMM dd, yyyy')}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>SIN:</Text>
          <Text style={styles.value}>{data.trustee.sin}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data.trustee.address}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{data.trustee.phone} | {data.trustee.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>3. BENEFICIARIES</Text>
        {data.beneficiaries.map((beneficiary, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subheading}>Beneficiary {index + 1}</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>{beneficiary.fullName}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Relationship:</Text>
              <Text style={styles.value}>{beneficiary.relationship}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{format(new Date(beneficiary.dateOfBirth), 'MMMM dd, yyyy')}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Distribution Instructions:</Text>
              <Text style={styles.value}>{beneficiary.distributionInstructions}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>4. TRUST DETAILS</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Trust Name:</Text>
          <Text style={styles.value}>{data.trustDetails.name}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{data.trustDetails.type.toUpperCase()}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Purpose:</Text>
          <Text style={styles.value}>{data.trustDetails.purpose}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Initial Property:</Text>
          <Text style={styles.value}>{data.trustDetails.initialProperty}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>5. ADDITIONAL PROVISIONS</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{data.additionalProvisions.duration}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Trustee Powers:</Text>
          <Text style={styles.value}>{data.additionalProvisions.trusteePowers}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Successor Trustee:</Text>
          <Text style={styles.value}>{data.additionalProvisions.successorTrustee}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Distribution Plan:</Text>
          <Text style={styles.value}>{data.additionalProvisions.distributionPlan}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Special Instructions:</Text>
          <Text style={styles.value}>{data.additionalProvisions.specialInstructions}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>6. FINANCIAL PLANNING</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Current Income:</Text>
          <Text style={styles.value}>{data.financialPlanning.currentIncome}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Goal Amount:</Text>
          <Text style={styles.value}>{data.financialPlanning.goalAmount}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Target Date:</Text>
          <Text style={styles.value}>{format(new Date(data.financialPlanning.targetDate), 'MMMM dd, yyyy')}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Financial Goal:</Text>
          <Text style={styles.value}>{data.financialPlanning.financialGoal}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>7. PROFESSIONAL ADVISORS</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Legal Advisor:</Text>
          <Text style={styles.value}>{data.professionalAdvisors.lawyer.name}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{data.professionalAdvisors.lawyer.contact}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Financial Advisor:</Text>
          <Text style={styles.value}>{data.professionalAdvisors.accountant.name}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{data.professionalAdvisors.accountant.contact}</Text>
        </View>
      </View>

      <View style={styles.declaration}>
        <Text>
          IN WITNESS WHEREOF, the parties hereto have executed this Trust Deed as of the day and year first above written.
          The Settlor hereby declares their intention to create a trust and transfers the initial trust property
          to the Trustee(s) to hold upon the trusts declared in this deed.
        </Text>
      </View>

      <View style={styles.signature}>
        <View style={styles.signatureLine}>
          <Text style={styles.signatureText}>Settlor</Text>
        </View>
        <View style={styles.signatureLine}>
          <Text style={styles.signatureText}>Trustee</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>This document was generated electronically on {format(new Date(), 'MMMM dd, yyyy')}</Text>
        <Text>Page 1 of 1</Text>
      </View>
    </Page>
  </Document>
);

export const generateTrustDocument = async (data: TrustFundData) => {
  const blob = await pdf(<TrustDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.trustDetails.name || 'trust-deed'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
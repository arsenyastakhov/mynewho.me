export const PROPERTY_STATUS = {
  READY: 'ready-to-move-in',
  SOON: 'available-soon',
  LEASED: 'leased',
};

export const formatAvailableDate = (dateString, options = {}) => {
  if (!dateString) return '';

  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
};

const isOnOrAfterAvailableDate = (dateString) => {
  if (!dateString) return false;

  const [year, month, day] = dateString.split('-').map(Number);
  const availableDate = new Date(year, month - 1, day);
  const today = new Date();

  availableDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return today >= availableDate;
};

export const getPropertyStatus = (property = {}) => {
  const { status, available, availableDate } = property;
  const isAvailableSoon = !available && Boolean(availableDate);
  const isLeased = Boolean(property.leased) || (!property.leased && !isAvailableSoon && status === PROPERTY_STATUS.LEASED) || (!status && !available && !availableDate);
  const shortDate = isAvailableSoon ? formatAvailableDate(availableDate) : '';
  const longDate = isAvailableSoon ? formatAvailableDate(availableDate, { month: 'long' }) : '';

  if (status === PROPERTY_STATUS.READY || (!status && available)) {
    return {
      key: PROPERTY_STATUS.READY,
      adminLabel: 'Ready to move in',
      cardLabel: 'Ready to move in',
      detailLabel: 'Ready to move in',
      badgeClass: 'ready',
      isReady: true,
      isLeased: false,
      isAvailableSoon: false,
      canScheduleTour: true,
      tourLabel: 'Schedule Self-Tour',
      showInListings: true,
      adminBadges: [{ label: 'Ready to move in', badgeClass: 'ready' }],
      detailBadges: [{ label: 'Ready to move in', badgeClass: 'ready' }],
    };
  }

  if (status === PROPERTY_STATUS.SOON || isAvailableSoon) {
    const canScheduleTour = !isLeased || isOnOrAfterAvailableDate(availableDate);

    return {
      key: PROPERTY_STATUS.SOON,
      adminLabel: shortDate ? `Available soon (${shortDate})` : 'Available soon',
      cardLabel: shortDate ? `Available soon ${shortDate}` : 'Available soon',
      detailLabel: longDate ? `Available ${longDate}` : 'Available soon',
      badgeClass: 'soon',
      isReady: false,
      isLeased,
      isAvailableSoon: true,
      canScheduleTour,
      tourLabel: canScheduleTour ? 'Schedule Self-Tour' : 'Tour Available On Move-In Date',
      showInListings: true,
      adminBadges: [
        ...(isLeased ? [{ label: 'Leased', badgeClass: 'leased' }] : []),
        { label: shortDate ? `Available soon (${shortDate})` : 'Available soon', badgeClass: 'soon' },
      ],
      detailBadges: [
        ...(isLeased ? [{ label: 'Currently Leased', badgeClass: 'leased' }] : []),
        { label: longDate ? `Available ${longDate}` : 'Available soon', badgeClass: 'soon' },
      ],
    };
  }

  return {
    key: PROPERTY_STATUS.LEASED,
    adminLabel: 'Leased',
    cardLabel: 'Leased',
    detailLabel: 'Currently Leased',
    badgeClass: 'leased',
    isReady: false,
    isLeased: true,
    isAvailableSoon: false,
    canScheduleTour: false,
    tourLabel: 'Currently Unavailable',
    showInListings: false,
    adminBadges: [{ label: 'Leased', badgeClass: 'leased' }],
    detailBadges: [{ label: 'Currently Leased', badgeClass: 'leased' }],
  };
};

export const buildPropertyStatusFields = ({ available, leased, availableDate }) => {
  if (available) {
    return {
      status: PROPERTY_STATUS.READY,
      available: true,
      leased: false,
      availableDate: '',
    };
  }

  if (availableDate) {
    return {
      status: PROPERTY_STATUS.SOON,
      available: false,
      leased: Boolean(leased),
      availableDate,
    };
  }

  return {
    status: PROPERTY_STATUS.LEASED,
    available: false,
    leased: Boolean(leased),
    availableDate: '',
  };
};

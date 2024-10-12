const irrelevantSubdomains = ['www', 'm'];

const relevantSubdomains = [];

// Function to get the root domain, considering relevant and irrelevant subdomains
export function getNormalizedDomain(url) {
  let DomainurlObj = new URL(url);
  let domainParts = DomainurlObj.hostname.split('.');

  // Handle domains like 'example.co.uk' (i.e., 3+ parts for country code TLDs)
  if (domainParts.length > 2) {
    const [subdomain, ...rest] = domainParts;

    // Check if the subdomain is irrelevant (e.g., 'www') and remove it
    if (irrelevantSubdomains.includes(subdomain.toLowerCase())) {
      return rest.join('.');
    }

    // Check if the subdomain is relevant and keep it
    if (relevantSubdomains.includes(subdomain.toLowerCase())) {
      return DomainurlObj.hostname; 
    }
  }

  // Default to keeping the domain as-is if no conditions are met
  return DomainurlObj.hostname;
}

// Function to normalize the URL
export function normalizeUrl(url) {
  let urlObj = new URL(url);

  // Normalize the domain (handle relevant/irrelevant subdomains)
  let normalizedDomain = getNormalizedDomain(url);

  // Rebuild the URL with normalized domain and path
  let normalizedUrl = ${urlObj.protocol}//${normalizedDomain}${urlObj.pathname};

  // Remove fragment and irrelevant query parameters
  urlObj.hash = '';
  urlObj.searchParams.delete('utm_source');
  urlObj.searchParams.delete('utm_medium');
  urlObj.searchParams.delete('utm_campaign');

  return normalizedUrl;
}

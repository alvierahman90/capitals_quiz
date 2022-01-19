#!/usr/bin/env python3

import sys
import json


def get_args():
    """ Get command line arguments """

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('file', help="The countries.json file to generate the output from", type=str)
    return parser.parse_args()


def main(args):
    """ Entry point for script """
    with open(args.file) as fp:
        countries = json.load(fp)

    country_list = []

    for country in countries:
        if len(country['capital']) < 1 or country['capital'][0] == "" or not country['independent']:
            continue
        country_list.append({
                'capital': country['capital'][0],
                'countryname': country['name']['common'],
                'region': country['region'],
                'subregion': country['subregion'],
                'languages': country['languages'],
                'code': country['cca3'].lower()
        })

    print('countries = ', end='')
    print(json.dumps(country_list), end=';')

    return 0


if __name__ == '__main__':
    try:
        sys.exit(main(get_args()))
    except KeyboardInterrupt:
        sys.exit(0)

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

    country_list = {}
    capital_list = {}

    for country in countries:
        if len(country['capital']) < 1 or country['capital'][0] == "" or not country['independent']:
            continue
        country_list[country['name']['common']] = {
                'answer': country['capital'][0],
                'region': country['region'],
                'subregion': country['subregion'],
                'languages': country['languages']
        }

        capital_list[country['capital'][0]] = {
                'answer': country['name']['common'],
                'region': country['region'],
                'subregion': country['subregion'],
                'languages': country['languages']
        }

    print('countries = ', end='')
    print(json.dumps(country_list), end=';')
    print('capitals = ', end='')
    print(json.dumps(capital_list))

    return 0


if __name__ == '__main__':
    try:
        sys.exit(main(get_args()))
    except KeyboardInterrupt:
        sys.exit(0)

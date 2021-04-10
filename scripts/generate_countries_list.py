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

    r = {}

    for country in countries:
        if len(country['capital']) < 1 or country['capital'][0] is None:
            continue
        r[country['name']['common']] = country['capital'][0]

    print('capitals = ', end='')
    print(json.dumps(r))

    return 0


if __name__ == '__main__':
    try:
        sys.exit(main(get_args()))
    except KeyboardInterrupt:
        sys.exit(0)
